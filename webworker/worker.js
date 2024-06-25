function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    });
}

async function compute(rawData) {
    // await sleep(rawData.length * 100);
    // let i = 0;
    // while (i < r * 1000000000) {
    //     i++;
    // }
    return (rawData || []).reduce((pre, cur) => pre + cur, 0);
}

self.onmessage = async function(event) {
    const { taskId, rawData } = event.data;
    const result = await compute(rawData); // 处理原数据
    console.log("🚀 ~ self.onmessage=function ~ result:", result)
    self.postMessage({ taskId, result });
}