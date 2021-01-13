print ('hello world')

## goal is for the sum total to be 2000
## and the step to double


## next step => mess with the base! then see if that makes it come out to rounder numbers
## then => adjust a few numbers +1 or -1 to make them come out rounder
base = 143
r = 1.072
sum = 0

step = base / r ## to offset multiplying for step 0

ten_steps = 0

print('Score','Step','Sum')
print(50,'N/A',0)
for i in range(1,11):
	step *= r
	step_rounded = round(step)
	sum += step_rounded
	print(i + 50, '+' + str(int(step_rounded)),int(sum))




