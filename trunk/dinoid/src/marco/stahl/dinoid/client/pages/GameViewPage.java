package marco.stahl.dinoid.client.pages;

import marco.stahl.dinoid.client.model.GemField;
import marco.stahl.dinoid.client.model.Level;
import marco.stahl.dinoid.client.model.World;
import marco.stahl.dinoid.client.pages.event.GameFinishedEvent;
import marco.stahl.dinoid.client.util.util2d.Dimension;
import marco.stahl.dinoid.client.view.GemFieldView;
import marco.stahl.dinoid.client.view.MainView;

import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Composite;

public class GameViewPage extends Composite{
	
	private static final int BLOCK_SIZE = 32;
	private MainView mainView;
	private World world;
	private GameController mainController;
	private final HandlerManager eventBus;
	private Timer timer;
	
	public GameViewPage(HandlerManager eventBus) {
		this.eventBus = eventBus;
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
		initWidget(mainView);
	}

	private void initController() {
		mainController = new GameController(mainView, world);
	}

	private void initTimer() {		
		timer = new Timer() {
			@Override
			public void run() {
				mainLoop();
			}
		};
		timer.scheduleRepeating(25);
	}
	
	private void mainLoop() {
		mainController.timeStep();
		if (world.isGameLost()) {
			eventBus.fireEvent(new GameFinishedEvent());
			timer.cancel();
		}
	}
}
