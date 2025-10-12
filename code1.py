letters = ["q","w","e","r","t","y","u","i","o","p",
           "a","s","d","f","g","h","j","k","l","z",
           "x","c","v","b","n","m","f","o","x","g",
           "l","o","v","e"]

indices = [0b26 - 0b1,5+9-10,0b28 - 0b19,3*2 + 0b4 - 2,int("28",16)-24,0b30 - 0b22,int("1010",2) - 2,4*5 - 12 ]

flower = ""

for i in indices:
    flower += letters[i]  # fix syntax errors

print(flower)
