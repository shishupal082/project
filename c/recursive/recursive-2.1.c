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
int rec2(int n) {
	// printf("rec2 called with value = %d\n", n);
	if (n<=1) {
		return n;
	}
	return (2*rec1(n-2) + 1);
}
int main() {
	int i;
	for (int i = 3; i < 6; i++) {
		printf("%d,", rec1(i));//2,3,6
	}
	printf("\n");
}
