from music21.tempo import MetronomeMark
from music21.note import Note, Rest
from music21.stream import Stream
from music21.clef import TrebleClef
from music21 import metadata
from music21 import instrument
from music21 import environment
from music21.converter.subConverters import ConverterMusicXML
import numpy as np
import librosa
from .CqtTransformer import CqtTransformer
from .OnsetDetection import OnsetDetection
from .TempoAndBeat import TempoAndBeat

us = environment.UserSettings()
us['musescoreDirectPNGPath'] = "C:/Program Files/MuseScore 3/bin/MuseScore3.exe"
us['musicxmlPath'] = "C:/Program Files/MuseScore 3/bin/MuseScore3.exe"


class Transcriptor():

    def __init__(self, x):
        self.x = x
        self.fs = 44100
        self.hop_length = int(2048*(1-0.5))
        self.n_bins = 74
        self.mag_exp = 2
        self.threshold = -40
        self.pre_post_max = 12

    def inter_cqt_tuning(self):
        self.cqtTrans = CqtTransformer(
            self.x, self.fs, self.hop_length, self.n_bins, self.mag_exp, self.threshold)
        self.cqtTrans.calc_cqt()
        self.onsetDetect = OnsetDetection(
            self.cqtTrans.get_CdB(), self.fs, self.hop_length, self.pre_post_max)
        self.onsetDetect.calc_onset()
        self.tempoAndBeats = TempoAndBeat(
            self.fs, self.onsetDetect.get_onset_env(), self.hop_length)
        self.tempoAndBeats.calc_tempo_and_beats()
        self.mm = MetronomeMark(
            referent='quarter', number=self.tempoAndBeats.get_tempo())

    # conver seconds to quarter-Notes
    def time_to_beat(self, duration, tempo):
        return (tempo*duration/60)

    # remap input to 0-1 for Sine AMplitude or to 0-127 for MIDI
    def remap(self, x, in_min, in_max, out_min, out_max):
        return (x - in_min)*(out_max - out_min) / (in_max - in_min) + out_min


    def myDurationAprox(self,note_duration,tempo):
        q = 60/tempo
        durations = [q/4,q/2,q,3*q/2,q*2,q*3,q*4]
        test=[]
        for i in durations:
            test.append(abs(i-note_duration))
        m=test.index(min(test))
        return durations[m]

    # Generate music21 notes
    def generate_sine_midi_note(self,f0_info, sr, n_duration):
        f0=f0_info[0]
        duration = librosa.frames_to_time(n_duration, sr=sr, hop_length=self.hop_length)
        note_duration = self.myDurationAprox(duration,self.tempoAndBeats.get_tempo())
        midi_velocity=int(round(self.remap(f0_info[1], self.cqtTrans.get_CdB().min(), self.cqtTrans.get_CdB().max(), 0, 127)))
        if f0==None:
            midi_note=None
            note_info=Rest(type=self.mm.secondsToDuration(note_duration).type)
            f0=0
        else:
            midi_note=round(librosa.hz_to_midi(f0))

            note = Note(nameWithOctave=librosa.midi_to_note(midi_note,unicode=False), type=self.mm.secondsToDuration(note_duration).type)
            note.volume.velocity = midi_velocity
            note_info = [note]
        return note_info

    # Estimate Pitch
    def estimate_pitch(self, segment, threshold):
        freqs = librosa.cqt_frequencies(n_bins=self.n_bins, fmin=librosa.note_to_hz('C1'),
                                        bins_per_octave=12)
        if segment.max() < threshold:
            return [None, np.mean((np.amax(segment, axis=0)))]
        else:
            f0 = int(np.mean((np.argmax(segment, axis=0))))
        return [freqs[f0], np.mean((np.amax(segment, axis=0)))]

    # Generate notes from Pitch estimation

    def estimate_pitch_and_notes(self, x, onset_boundaries, i, sr):
        n0 = onset_boundaries[i]
        n1 = onset_boundaries[i+1]
        f0_info = self.estimate_pitch(
            np.mean(x[:, n0:n1], axis=1), threshold=self.threshold)
        return self.generate_sine_midi_note(f0_info, sr, n1-n0)

    def generateScore(self,scoreName):
        self.inter_cqt_tuning()
        # Array of music information - muisc21 Notes
        note_info = np.array([
            self.estimate_pitch_and_notes(self.cqtTrans.get_CdB(
            ), self.onsetDetect.get_onset_boundaries(), i, sr=self.fs)
            for i in range(len(self.onsetDetect.get_onset_boundaries())-1)
        ])


        # Create music21 stream
        s = Stream()
        cl = TrebleClef()
        s.append(self.mm)
        # s.append(cl)
        flute = instrument.fromString('flute')
        s.append(flute)
        s.insert(0, metadata.Metadata())
        s.metadata.title = scoreName
        for note in note_info:
            s.append(note)

        # Analyse music21 stream to get song Key
        key = s.analyze('key')
        # Insert Key to Stream
        s.insert(0, key)
        # Musescore
        conv_musicxml = ConverterMusicXML()
        filepath = 'D:\\An3\\Licenta\\automaticMusicTranscription\\frontend\\gui\\src\\download\\YourMusicSheet'
        out_filepath = conv_musicxml.write(
            s, 'musicxml', fp=filepath, subformats=['pdf'])

        return filepath + '.pdf'
        # s.show()
