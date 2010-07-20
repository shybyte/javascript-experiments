package marco.stahl.dinoid.client.model;

import java.util.Collection;
import java.util.List;

import marco.stahl.dinoid.client.util.CollectionUtils;

public class World {
	private static final int SHOOT_SPEED_Y = -10;
	private Dimension viewDimension;
	private GemField gemField;
	private List<Shot> shots;
	private CollisionsDetector collosionsDetector = new CollisionsDetector();

	public World(Dimension viewDimension, GemField gemField) {
		super();
		this.viewDimension = viewDimension;
		this.gemField = gemField;
		shots = CollectionUtils.newArrayList();
	}

	public void move(double timeDelta) {
		gemField.move(timeDelta);
		moveShoots(timeDelta);
		shots.removeAll(shotsAboveTop());
		handleCollosions();
	}

	private void handleCollosions() {
		Collection<Collision> collosions = collosionsDetector.detectCollisions(gemField, shots);
		removeCollidedShots(collosions);
		changeCollidedGems(collosions);
	}

	private void changeCollidedGems(Collection<Collision> collosions) {
		gemField.clearChangedGems();
		for (Collision collosion : collosions) {
			gemField.onShootedGem(collosion.getGemFieldX(),collosion.getGemFieldY());
		}
	}

	private void removeCollidedShots(Collection<Collision> collosions) {
		for (Collision collosion : collosions) {
			shots.remove(collosion.getShot());
		}
	}

	private void moveShoots(double timeDelta) {
		for (Shot shot : shots) {
			shot.move(timeDelta);
		}
	}

	private Collection<Shot> shotsAboveTop() {
		List<Shot> shotsAboveTop = CollectionUtils.newArrayList();
		for (Shot shot : shots) {
			if (shot.getY() < -10) {
				shotsAboveTop.add(shot);
			}
		}
		return shotsAboveTop;
	}

	public void shot(double x, double y) {
		shots.add(new Shot(Math.floor(x), viewDimension.height, SHOOT_SPEED_Y));
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
