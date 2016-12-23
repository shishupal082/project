#include <stdio.h>
void rec(int n) {
	printf("rec called with value = %d\n", n);
	if (n<=1) {
		return;
	}
	rec(n-2);
	rec(n-3);
}
int main() {
	printf("========\n");
	rec(1);
	printf("========\n");
	rec(2);
	printf("========\n");
	rec(5);
	printf("\n");
}
