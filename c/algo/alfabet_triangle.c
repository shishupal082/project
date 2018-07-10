//c-2018-06-28-001-q

#include <stdio.h>
int main(int argc, char const *argv[]) {
	int c=65, i, j, k, n = 5, w=5, x=5, y=5, z=5;
	printf("%d,%d,%d,%d", ++w, x++, --y, z--);
	printf("\n");
	for (i=1; i<=n; i++) {
		for (j=i; j<=n; j++) {
			printf("  ");
		}
		for (k=1; k<=i; k++) {
			printf("%c ", c++);
		}
		c--;
		for (k=1; k<=i-1; k++) {
			printf("%c ", --c);
		}
		printf("\n");
	}
	return 0;
}
/*
Results ....
6,5,4,5
          A 
        A B B 
      A B C C B 
    A B C D D C B 
  A B C D E E D C B 

----------------------------
A --> 65
a --> 97
0 --> 48

Below code will also work

for (j=i; j<=n; j++) {
	printf("  ");
}
for (k=1; k<=i; k++) {
	printf("%c ", c++);
}
c--;
k--;
for (; k>1; k--) {
	// printf("%d \n", i);
	printf("%c ", --c);
}
printf("\n");

*/