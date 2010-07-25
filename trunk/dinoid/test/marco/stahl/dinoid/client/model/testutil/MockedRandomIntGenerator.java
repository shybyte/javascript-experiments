package marco.stahl.dinoid.client.model.testutil;

import marco.stahl.dinoid.client.util.RandomIntGenerator;

public class MockedRandomIntGenerator implements RandomIntGenerator {

	private final int[] numbers;
	private int i;

	public MockedRandomIntGenerator(int... numbers) {
		this.numbers = numbers;
	}

	@Override
	public int getInt(int limit) {
		return numbers[(i++) % numbers.length] & limit;
	}

}
