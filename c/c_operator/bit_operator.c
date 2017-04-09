//https://www.tutorialspoint.com/cprogramming/c_bitwise_operators.htm

#include <stdio.h>
int main() {
    unsigned int a = 60; //0011 1100;
    unsigned int b = 13; //0000 1101;
    printf("AND operation (&) = %d\n", a&b); // 12 (0000 1100)
    printf("OR operation (!) = %d\n", a|b); // 61 (0011 1101)
    printf("XOR operation (^) = %d\n", a^b); // 49 (0011 0001)
    printf("NOT operation (~) = %d\n", ~a); // -61 (1100 0011)
    printf("Multiply by 2^n (<<n) = %d\n", a<<2); // 240 (1111 0000)
    printf("Divide by 2^n (>>n) = %d\n", a>>2); // 15 (0000 1111)
    return 0;
}