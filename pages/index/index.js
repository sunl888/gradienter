Page({
  data: {
    radius: 150,      // 大圆的半径（用于统一控制位置计算）
    bubbleSize: 10,   // 小球半径
    bubbleX: 0,       // 小球在水平仪中的X轴位置
    bubbleY: 0,       // 小球在水平仪中的Y轴位置
    bubbleColor: 'red', // 小球颜色（默认红色）
    xAngle: 0,        // X轴（水平）角度
    yAngle: 0,        // Y轴（垂直）角度
    zAngle: 0         // Z轴的加速度角度
  },

  // 开始监听加速度
  startMonitoring() {
    const that = this;
    wx.onAccelerometerChange(function (res) {
      const radius = that.data.radius - that.data.bubbleSize; // 最大可移动范围
      const xAngle = (Math.atan2(res.y, res.z) * 180) / Math.PI;
      const yAngle = (Math.atan2(res.x, res.z) * 180) / Math.PI;

      // 计算小球的X和Y偏移量，确保小球能够到达大圆边缘
      const bubbleX = Math.min(Math.max(res.x * radius, -radius), radius);
      const bubbleY = Math.min(Math.max(res.y * radius, -radius), radius);

      // 计算小球到中心的距离（勾股定理），并将绿色范围缩小
      const distanceToCenter = Math.sqrt(Math.pow(bubbleX, 2) + Math.pow(bubbleY, 2));
      const bubbleColor = distanceToCenter < 20 ? 'green' : 'red'; // 距离小于20px变绿

      that.setData({
        bubbleX: bubbleX,
        bubbleY: bubbleY,
        bubbleColor: bubbleColor,
        xAngle: res.x.toFixed(2),
        yAngle: res.y.toFixed(2),
        zAngle: res.z.toFixed(2)
      });
    });
  },

  // 停止监听加速度
  stopMonitoring() {
    wx.stopAccelerometer();
  },

  onUnload() {
    wx.stopAccelerometer();  // 页面卸载时停止监听
  }
});
