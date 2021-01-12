print ('hello world')

## goal is for the sum total to be 2000
## and the step to double


## next step => mess with the base! then see if that makes it come out to rounder numbers
## then => adjust a few numbers +1 or -1 to make them come out rounder
base = 100
r = 1.072
sum = 0

step = base

ten_steps = 0

print('Score','Step','Sum')
print(50,'N/A',0)
for i in range(1,52):
	step *= r
	step_rounded = round(step)
	sum += step_rounded
	ten_steps += step_rounded
	if ((i - 1) % 10 == 0 and i != 1): ## there is an error here, make sure it is calculating this correctly!
		print('               ' + str(i - 11 + 50) + ' to ' + str(i-1 + 50), int(ten_steps - step_rounded))
		ten_steps = 0
	print(i + 50, '+' + str(int(step_rounded)),int(sum))

