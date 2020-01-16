#include <stdio.h>
#include "partial.c"

int a=5;
extern void displayA(); // Not mandatory
extern int b; // Optional

int main(int argc, char const *argv[])
{
	int a = 5;
	printf("value of a in main = %d\n", a);
	displayA();
	printf("value of b in main = %d\n", b);
	return 0;
}