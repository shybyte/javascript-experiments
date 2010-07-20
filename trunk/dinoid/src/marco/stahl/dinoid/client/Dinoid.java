package marco.stahl.dinoid.client;

import marco.stahl.dinoid.client.model.GemField;
import marco.stahl.dinoid.client.model.Level;
import marco.stahl.dinoid.client.model.World;
import marco.stahl.dinoid.client.util.util2d.Dimension;
import marco.stahl.dinoid.client.view.GemFieldView;
import marco.stahl.dinoid.client.view.MainView;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.RootPanel;

public class Dinoid implements EntryPoint {
	private static final int BLOCK_SIZE = 32;
	private MainView mainView;
	private World world;
	private Controller mainController;

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
		mainView = new MainView(world, gemFieldView, Dinoid.BLOCK_SIZE);
		RootPanel.get("app").add(mainView);
	}

	private void initController() {
		mainController = new Controller(mainView, world);
	}

	private void initTimer() {		
		new Timer() {
			@Override
			public void run() {
				mainLoop();
			}
		}.scheduleRepeating(25);
	}
	
	private void mainLoop() {
		mainController.timeStep();
	}


}
