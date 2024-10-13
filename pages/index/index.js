Page({
  data: {
    radius: 150,      // 大圆的半径
    bubbleSize: 8,  // 小球的直径
    bubbleX: 0,       // 小球X轴偏移量，初始为0（居中）
    bubbleY: 0,       // 小球Y轴偏移量，初始为0（居中）
    bubbleColor: 'green', // 小球默认颜色为绿色（因为在中心）
    xValue: '0.00',   // 加速度传感器X轴的初始值，默认0.00
    yValue: '0.00',   // 加速度传感器Y轴的初始值，默认0.00
    zValue: '0.00',   // 加速度传感器Z轴的初始值，默认0.00
    isMonitoring: false // 控制是否监听的状态，默认不监听
  },
   
  // 切换监听状态
  toggleMonitoring() {
    if (this.data.isMonitoring) {
      this.stopMonitoring(); // 如果正在监听，则停止
    } else {
      this.startMonitoring(); // 如果没有监听，则开始监听
    }
    this.setData({
      isMonitoring: !this.data.isMonitoring // 切换状态
    });
  },

  // 开始监听加速度
  startMonitoring() {
    wx.onAccelerometerChange((res) => {
      const radius = this.data.radius - this.data.bubbleSize / 2; // 最大可移动范围
      // 计算小球的X和Y偏移量，确保小球能够到达大圆边缘
      const bubbleX = Math.min(Math.max(res.x * radius, -radius), radius);
      const bubbleY = Math.min(Math.max(-res.y * radius, -radius), radius);

      // 计算小球到中心的距离（勾股定理）
      const distanceToCenter = Math.sqrt(Math.pow(bubbleX, 2) + Math.pow(bubbleY, 2));

      // 设定高精度阈值，比如 2px 以内才变绿
      const threshold = 2; // 阈值可以根据需求调整

      // 根据距离判断颜色，距离小于阈值变为绿色，否则保持红色
      const bubbleColor = distanceToCenter < threshold ? 'green' : 'red';

      // 更新界面数据
      this.setData({
        bubbleX: bubbleX,  // 更新小球X位置
        bubbleY: bubbleY,  // 更新小球Y位置
        bubbleColor: bubbleColor,  // 更新小球颜色
        xValue: res.x.toFixed(4),  // 显示加速度传感器X轴值
        yValue: res.y.toFixed(4),  // 显示加速度传感器Y轴值
        zValue: res.z.toFixed(4)   // 显示加速度传感器Z轴值
      });
    });
  },

  // 停止监听加速度
  stopMonitoring() {
    wx.stopAccelerometer();  // 停止监听加速度
  },

  onUnload() {
    this.stopMonitoring();  // 页面卸载时停止监听
  }
});
