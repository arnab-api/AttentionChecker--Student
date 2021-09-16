# AttentionChecker--Student
This project integrates [**webgazer**](https://github.com/brownhci/WebGazer); an eyetracking library to a simple website. A live demo is available [*here*](https://erdos.dsm.fordham.edu/~arnab/)
This projects has been built to collect gaze tracking data from participants for calculating attention score while attending an online class or during watching an online tutorial.

## Performance
    * Yields best performance when the participants
        * sit infront of a webcam at eye level.
        * keep their head as still as possible during the calibration process and keep their head in similar pose and position during tracking.
    * The eye tracking can require some processing power. So number of gaze points per second will vary from device to device.
    * Accuracy is lower on the edges compared to center positions. But one might be able to improve that by tweaking the `calibration_points` array or using a different approach for calibration. **Warning:** Over calibration will cause the model to overfit and might reduce performance.