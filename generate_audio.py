import wave
import struct
import math

def generate_loop(filename="public/audio/ambient-loop.wav"):
    sample_rate = 44100
    duration = 8.0 # 8 second perfect loop
    num_samples = int(sample_rate * duration)
    
    # Frequencies for a calm, ambient Cmaj9 chord (C3, E3, G3, B3, D4)
    # using lower sine waves for that "deep space" puzzle feel
    freqs = [130.81, 164.81, 196.00, 246.94, 293.66]
    
    # Create wave file
    wav_file = wave.open(filename, 'w')
    wav_file.setnchannels(1) # mono
    wav_file.setsampwidth(2) # 2 bytes
    wav_file.setframerate(sample_rate)
    
    for i in range(num_samples):
        t = float(i) / sample_rate
        
        # Calculate LFO volume swells (slow ambient pulse)
        # We want the pulse to perfectly loop over 8 seconds.
        # sin(2 * pi * t * 0.125) has a period of 8 seconds
        lfo = 0.5 + 0.5 * math.sin(2 * math.pi * t * 0.125)
        
        # Inlined LFO calculation over 8 seconds
        lfo_amp = 0.6 + 0.4 * math.sin(2 * math.pi * t * (1.0 / duration))
        
        # Individual detune phasing per frequency for chorus effect
        sample = 0.0
        for idx, f in enumerate(freqs):
            phase_offset = math.sin(2 * math.pi * t * (0.1 * (idx+1))) * 0.02
            sample += math.sin(2 * math.pi * (f + phase_offset) * t)
            
        sample = (sample / len(freqs)) * lfo_amp * 0.15 # Quiet ambient background
        
        # Convert to 16-bit integer
        int_sample = int(sample * 32767.0)
        
        packed_value = struct.pack('h', int_sample)
        wav_file.writeframes(packed_value)

    wav_file.close()
    print(f"Generated {filename}")

if __name__ == "__main__":
    generate_loop()
