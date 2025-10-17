letters = ['q','w','e','r','t','y','u','i','o','p',
           'a','s','d','f','g','h','j','k','l','z',
           'x','c','v','b','n','m']

fog = [0b11, 0x7, 0o14]
whispers = ("echo" * 2)[::-1]
shadows = [0b101, 0x4, 11]

i1 = (0b1100 + 0b1)
i2 = (2 << 1) + 3 + 2
i3 = sum([10 - 3, 0])
i4 = (0x11 - 4)
i5 = int(((3 << 3) - 7) / 2)
i6 = (len("glow") + 13) - 10
i7 = ord('x') - 100
i8 = (int("2")**2) - 3 + 2

indices = [12, 7, 19, 13, 17, 7, 21, 1]

flower = ""
for idx in indices:
    flower += letters[idx + 1]

for f in fog + shadows:
    flower += "" * f

for w in whispers:
    flower += "" if w in "aeiou" else ""

print(flower)
