#include <stdio.h>
int rec1(int n);
int rec2(int n);

int rec1(int n) {
	// printf("rec1 called with value = %d\n", n);
	if (n<=1) {
		return n;
	}
	return (rec1(n-1) + rec2(n-2));
}
int rec1_copy(int n) {
	// printf("rec1_copy called with value = %d\n", n);
	int a, b;
	if (n<=1) {
		return n;
	}
	a = rec1_copy(n-1);
	b = rec2(n-2);
	return (a + b);
}
int rec1_copy_2(int n) {
	// printf("rec1_copy_2 called with value = %d\n", n);
	int a, b;
	if (n<=1) {
		return n;
	}
	b = rec2(n-2);
	a = rec1_copy_2(n-1);
	return (a + b);
}
int rec2(int n) {
	// printf("rec2 called with value = %d\n", n);
	if (n<=1) {
		return n;
	}
	return (2*rec1(n-2) + 1);
}
void callMethod(int input) {
	int result = 0;
	printf("========\n");
	result = rec1(input); // result = input (for <=1)
	printf("**Result for input using rec1 = %d is %d\n", input, result);
	result = rec1_copy(input); // result = input (for <=1)
	printf("**Result for input using rec1_copy = %d is %d\n", input, result);
	result = rec1_copy_2(input); // result = input (for <=1)
	printf("**Result for input using rec1_copy_2 = %d is %d\n", input, result);
}
int main() {
	callMethod(1);//1
	callMethod(2);//1
	callMethod(3);//2
	callMethod(4);//3
	callMethod(5);//6
	callMethod(6);//9
	callMethod(21);
	printf("\n");
}

/*
Note : 
return (rec1(n-1) + rec2(n-2));
---------------------------------------
is equivalent to :
a = rec1(n-1);
b = rec2(n-2);
return (a + b);
---------------------------------------
is equivalent to :
b = rec2(n-2);
a = rec1(n-1);
return (a + b);
*/