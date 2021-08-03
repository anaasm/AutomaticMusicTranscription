import librosa


class TempoAndBeat():

    def __init__(self, fs, onset_env, hop_length):
        self.fs = fs
        self.onset_env = onset_env
        self.hop_length = hop_length

    def get_tempo(self):
        return self.tempo

    def get_beats(self):
        return self.beats

    def calc_tempo_and_beats(self):
        self.tempo, self.beats = librosa.beat.beat_track(y=None, sr=self.fs, onset_envelope=self.onset_env, hop_length=self.hop_length,
                                                         start_bpm=120.0, tightness=100, trim=True, bpm=None,
                                                         units='frames')

        self.tempo = int(2*round(self.tempo/2))
