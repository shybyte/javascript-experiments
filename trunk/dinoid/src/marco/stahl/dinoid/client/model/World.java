package marco.stahl.dinoid.client.model;

import java.util.List;

import marco.stahl.dinoid.client.util.CollectionUtils;

public class World {
	private Dimension viewDimension;
	private GemField gemField;
	private List<Shot> shots;

	public World(Dimension viewDimension, GemField gemField) {
		super();
		this.viewDimension = viewDimension;
		this.gemField = gemField;
		shots = CollectionUtils.newArrayList();
	}

	public void move(double timeDelta) {
		gemField.move(timeDelta);
		moveShoots(timeDelta);
	}

	private void moveShoots(double timeDelta) {
		List<Shot> shotsToDelete = CollectionUtils.newArrayList();
		for (Shot shot : shots) {
			shot.move(timeDelta);
			if (shot.getY() < -1) {
				shotsToDelete.add(shot);
			}
		}
		shots.removeAll(shotsToDelete);
	}

	public void shot(double x, double y) {
		shots.add(new Shot(Math.floor(x), viewDimension.height, -10));
	}
	
	public GemField getGemField() {
		return gemField;
	}
	
	public Dimension getViewDimension() {
		return viewDimension;
	}
	
	public List<Shot> getShots() {
		return shots;
	}
}
