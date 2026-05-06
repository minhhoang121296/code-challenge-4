
// Iterative - walks every term; straightforward for any integer n.
// even if n is negative, we still need to walk every term.

export function sum_to_n_a(n: number): number {
  if (n === 0) return 0;
  if (n > 0) return (n * (n + 1)) / 2;
  return (-n * (n - 1)) / 2;
}
// Time: O(1), Space: O(1). Best solution for large n.

export function sum_to_n_b(n: number): number {
  if (n === 0) return 0;
  if (n > 0) {
    let total = 0;
    for (let i = 1; i <= n; i++) total += i;
    return total;
  }
  let total = 0;
  for (let i = n; i <= -1; i++) total += i;
  return total;
}
// Time: O(n), Space: O(1)


// Recursive
export function sum_to_n_c(n: number): number {
  if (n === 0) return 0;
  if (n > 0) return n + sum_to_n_c(n - 1);
  return n + sum_to_n_c(n + 1);
}
// Time: O(n), Space: O(n) call stack. Stack overflow risk for very large n
