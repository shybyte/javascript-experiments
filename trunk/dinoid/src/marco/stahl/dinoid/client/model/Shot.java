package marco.stahl.dinoid.client.model;

public class Shot {
	private double x;
	private double y;
	private double speedY;
	
	
	public Shot(double x, double y, double speedY) {
		this.x = x;
		this.y = y;
		this.speedY = speedY;
	}
	
	public double getX() {
		return x;
	}
	
	public double getY() {
		return y;
	}


	public void move(double timeDelta) {
		y += speedY*timeDelta;
	}

	@Override
	public String toString() {
		return "Shot [x=" + x + ", y=" + y +"]";
	}
	
	
}
