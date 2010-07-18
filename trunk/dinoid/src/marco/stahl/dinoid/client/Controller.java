package marco.stahl.dinoid.client;

import marco.stahl.dinoid.client.model.World;
import marco.stahl.dinoid.client.view.MainView;

public class Controller {
	MainView mainView;
	World world;
	
	public Controller(MainView mainView, World world) {
		this.mainView = mainView;
		this.world = world;
	}

	
	
}
