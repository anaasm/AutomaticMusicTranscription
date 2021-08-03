import librosa
import numpy as np


class CqtTransformer():
    def __init__(self, x, fs, hop_length, n_bins, mag_exp, cqt_threshold):
        self.x = x
        self.fs = fs
        self.hop_length = hop_length
        self.n_bins = n_bins
        self.mag_exp = mag_exp
        self.thres = cqt_threshold
        self.CdB = []

    def get_CdB(self):
        return self.CdB

    def calc_cqt(self):
        C = librosa.cqt(
            self.x, sr=self.fs, hop_length=self.hop_length, fmin=None, n_bins=self.n_bins)
        C_mag = librosa.magphase(C)[0]**self.mag_exp
        CdB = librosa.core.amplitude_to_db(C_mag, ref=np.max)
        self.CdB = self.cqt_thresholded(CdB)
        self.CdB = CdB

    def cqt_thresholded(self,cqt):
        new_cqt = np.copy(cqt)
        new_cqt[new_cqt < self.thres] = -120
        return new_cqt
