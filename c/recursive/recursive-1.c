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
	rec(1); //1
	printf("========\n");
	rec(2); //2, 0, -1
	printf("========\n");
	rec(5); //5, 3, 1, 0, 2, 0, -1
	printf("\n");
}
