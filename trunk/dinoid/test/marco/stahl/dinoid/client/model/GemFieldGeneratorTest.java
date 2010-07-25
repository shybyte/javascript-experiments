package marco.stahl.dinoid.client.model;

import static org.junit.Assert.*;

import marco.stahl.dinoid.client.model.testutil.MockedRandomIntGenerator;
import marco.stahl.dinoid.client.util.RandomIntGenerator;
import marco.stahl.dinoid.client.util.RandomIntGeneratorImpl;
import marco.stahl.dinoid.client.util.util2d.Dimension;

import org.junit.Before;
import org.junit.Test;

public class GemFieldGeneratorTest {
	private GemFieldGenerator generator;
	private RandomIntGenerator randomGen;

	@Before
	public void setUp() throws Exception {
	}
	
	@Test
	public void testAddHorizonalGroupToRowDoesNotOveriddeExistingGems() {
		givenRandomNumbers(0,0,2,2,0,0,1,2);
		givenGenerator();
		
		generator.addHorizonalRandomizedGroup(3,0,0);
		
		print();
	}

	@Test
	public void testAddHorizonalGroupToRow() {
		givenRandomNumbers(0,0,2,2,0,0,1,2);
		givenGenerator();
		
		generator.addHorizonalRandomizedGroup(3,0,0);
		
		print();
	}

	private void givenGenerator() {
		generator = new GemFieldGenerator(new Dimension(10, 4), randomGen);
	}

	private void givenRandomNumbers(int... numbers) {
		randomGen = new MockedRandomIntGenerator(numbers);
		// randomGen = new RandomIntGeneratorImpl();
	}

	private void print() {
		generator.getGemField().printMapAsPrettyString();
	}

}
