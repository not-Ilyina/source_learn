// function dfs(n) {
//     const dp = new Array(n+1);
//     dp[0] = 0;
//     dp[1] = 1;
//     dp[2] = 1;
//     for (let i = 3; i <= n; i++) {
//         dp[i] = dp[i-1] + dp[i-2];
//     }
//     return dp[n];
// }

function dfs(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 1;
    return dfs(n-1) + dfs(n-2);
}

// 0 1 1 2
const res = dfs(10);
console.log(res);