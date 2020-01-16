#include <stdio.h>

int main(int argc, char const *argv[])
{
	register int a;
	int b  = 10;
	int *p, *q;
	// p = &a; /*Generate error : address of register variable requested*/
	q = &b;
	// printf("%u\n", *p);
	printf("%u\n", q);
	return 0;
}