

theScale = [143,154,165,177,189,203,218,234,249,268]

multiplier = 2

def nextStep(i):
    return theScale[(i - 50) % 10 - 1] * ((i - 51) / 10 + 1) * multiplier

sum = 0
for i in range(51,101):
    step = nextStep(i)
    sum += step
    print(i, step, sum)

    # is this what i wanted?

    # 50 = 0; 60 = 2000; 70 = 6000; 80 = 12000; 90 = 20000; 100 = 30000