package marco.stahl.dinoid.client;

import java.util.Date;

import marco.stahl.dinoid.client.model.Dimension;
import marco.stahl.dinoid.client.model.GemField;
import marco.stahl.dinoid.client.model.Level;
import marco.stahl.dinoid.client.model.World;
import marco.stahl.dinoid.client.view.GemFieldView;
import marco.stahl.dinoid.client.view.MainView;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.RootPanel;

public class Dinoid implements EntryPoint {
	private static final int BLOCK_SIZE = 32;
	private Date lastTime;
	private MainView mainView;
	private World world;

	public void onModuleLoad() {
		initWorld();
		initViews();
		initController();
		initTimer();
	}

	private void initWorld() {
		final GemField gemField = new GemField(new Dimension(10, 20));
		gemField.initFromString(Level.level1);
		gemField.moveToStartPosition();
		world = new World(new Dimension(10, 12), gemField);
	}

	private void initViews() {
		GemFieldView gemFieldView = new GemFieldView(BLOCK_SIZE, world.getGemField());
		mainView = new MainView(world, gemFieldView, BLOCK_SIZE);
		RootPanel.get("app").add(mainView);
	}

	private void initController() {
		Controller controller = new Controller(mainView, world);
	}

	private void initTimer() {
		lastTime = new Date();
		new Timer() {
			@Override
			public void run() {
				mainLoop();
			}
		}.scheduleRepeating(25);
	}
	
	private void mainLoop() {
		Date currentTime = new Date();
		world.move(getTimeDeltaInSeconds(currentTime, lastTime));
		mainView.refresh();
		lastTime = currentTime;
	}

	private double getTimeDeltaInSeconds(Date currentTime, Date lastTime2) {
		return ((double) (currentTime.getTime() - lastTime2.getTime())) / 1000;
	}
}
