package marco.stahl.dinoid.client;

import java.util.Date;

import marco.stahl.dinoid.client.model.World;
import marco.stahl.dinoid.client.view.MainView;

public class Controller {
	private MainView mainView;
	private World world;
	private Date lastTime;
	
	public Controller(MainView mainView, World world) {
		this.mainView = mainView;
		this.world = world;
		lastTime = new Date();
	}

	public void timeStep() {
		Date currentTime = new Date();
		world.move(getTimeDeltaInSeconds(currentTime, lastTime));
		mainView.refresh();
		lastTime = currentTime;
	}
	
	private double getTimeDeltaInSeconds(Date currentTime, Date lastTime2) {
		return ((double) (currentTime.getTime() - lastTime2.getTime())) / 1000;
	}

	
	
}
