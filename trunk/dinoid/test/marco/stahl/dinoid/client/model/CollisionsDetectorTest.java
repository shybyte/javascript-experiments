package marco.stahl.dinoid.client.model;

import static org.hamcrest.collection.IsIterableContainingInAnyOrder.*;
import static org.junit.Assert.*;

import java.util.Collection;

import marco.stahl.dinoid.client.util.CollectionUtils;

import org.junit.Before;
import org.junit.Test;

public class CollisionsDetectorTest {

	private Dimension gemFieldDimension;
	private Dimension viewDimension;
	private GemField gemField;
	private CollisionsDetector collosionsDetector;
	private Collection<Collision> collosions;
	private Collection<Shot> shots;

	@Before
	public void setUp() throws Exception {
		collosionsDetector = new CollisionsDetector();
		viewDimension = new Dimension(3, 5);
		gemFieldDimension = new Dimension(3, 3);
		gemField = new GemField(gemFieldDimension);
	}
	
	@Test
	public void testShotAboveGem() {
		givenGemFieldAtPosY("" + //
				"r  " + //
				"gg " + //
				"g b", 0);
		
		Shot middleShot = shot(1,0 );
		givenShots(middleShot);

		collosions = collosionsDetector.detectCollisions(gemField, shots);

		assertThat(collosions, containsInAnyOrder(new Collision(middleShot, 1, 1)));
	}
	
	@Test
	public void testShotAboveGemField() {
		givenGemFieldAtPosY("" + //
				"r  " + //
				"g  " + //
				"g b", 0);
		
		Shot middleShot = shot(1,-1 );
		Shot rightShot = shot(2,-1 );
		givenShots(middleShot,rightShot);

		collosions = collosionsDetector.detectCollisions(gemField, shots);

		assertThat(collosions, containsInAnyOrder(new Collision(rightShot, 2, 2)));
	}

	@Test
	public void testDetectCollections() {
		givenGemFieldAtPosY("" + //
				"r  " + //
				"gg " + //
				"g b", 0);
		
		Shot leftShot = shot(0, 2);
		Shot leftShotNoCollision = shot(0, 3);
		Shot middleShot = shot(1,0 );
		givenShots(leftShot,leftShotNoCollision,middleShot);

		collosions = collosionsDetector.detectCollisions(gemField, shots);

		assertThat(collosions, containsInAnyOrder(new Collision(leftShot, 0, 2),new Collision(middleShot, 1, 1)));
	}
	
	@Test
	public void testDetectCollectionsWithPosY() {
		givenGemFieldAtPosY("" + //
				"r  " + //
				"gg " + //
				"g b", -1);
		
		Shot leftShot = shot(0, 2);
		Shot leftShotNoCollision = shot(0, 4);
		Shot middleShot = shot(1,0 );
		givenShots(leftShot,leftShotNoCollision,middleShot);

		collosions = collosionsDetector.detectCollisions(gemField, shots);

		assertThat(collosions, containsInAnyOrder(new Collision(middleShot, 1, 1)));
	}

	private void givenShots(Shot... shots) {
		this.shots = CollectionUtils.newArrayList(shots);
	}

	private void givenGemFieldAtPosY(String levelString, double posY) {
		gemField.posY = posY;
		gemField.initFromString(levelString);
	}

	private Shot shot(double x, double y) {
		return new Shot(x, y, -1);
	}

}
