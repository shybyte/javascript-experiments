package marco.stahl.dinoid.client.model;

public class Collision {
	private Shot shot;
	private int gemFieldX;
	private int gemFieldY;

	public Collision(Shot shot, int gemFieldX, int gemFieldY) {
		super();
		this.shot = shot;
		this.gemFieldX = gemFieldX;
		this.gemFieldY = gemFieldY;
	}

	public Shot getShot() {
		return shot;
	}

	public int getGemFieldX() {
		return gemFieldX;
	}

	public int getGemFieldY() {
		return gemFieldY;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + gemFieldX;
		result = prime * result + gemFieldY;
		result = prime * result + ((shot == null) ? 0 : shot.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		return equals((Collision) obj);
	}

	private boolean equals(Collision other) {
		if (gemFieldX != other.gemFieldX)
			return false;
		if (gemFieldY != other.gemFieldY)
			return false;
		if (shot == null) {
			if (other.shot != null)
				return false;
		} else if (!shot.equals(other.shot))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Collosion [shot=" + shot + ", gemFieldX=" + gemFieldX
				+ ", gemFieldY=" + gemFieldY + "]";
	}

	
	
	
}
