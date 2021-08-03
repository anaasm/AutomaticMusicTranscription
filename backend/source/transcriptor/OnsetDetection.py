import librosa
import numpy as np


class OnsetDetection():

    def __init__(self, cqt, fs, hop_length, pre_post_max):
        self.cqt = cqt
        self.fs = fs
        self.hop_length = hop_length
        self.pre_post_max = pre_post_max

    def get_onset_env(self):
        return self.onset_env

    def get_onset_boundaries(self):
        return self.onset_boundaries

    def get_onset_times(self):
        return self.onset_times

    def calc_onset_env(self, cqt):
        return librosa.onset.onset_strength(S=cqt, sr=self.fs, aggregate=np.mean, hop_length=self.hop_length)

    def calc_onset(self, backtrack=True):
        self.onset_env = self.calc_onset_env(self.cqt)
        onset_frames = librosa.onset.onset_detect(onset_envelope=self.onset_env,
                                                  sr=self.fs, units='frames',
                                                  hop_length=self.hop_length,
                                                  backtrack=backtrack,
                                                  pre_max=self.pre_post_max,
                                                  post_max=self.pre_post_max)
        self.onset_boundaries = np.concatenate(
            [[0], onset_frames, [self.cqt.shape[1]]])
        self.onset_times = librosa.frames_to_time(
            self.onset_boundaries, sr=self.fs, hop_length=self.hop_length)