package marco.stahl.dinoid.client.pages.event;


import com.google.gwt.event.shared.GwtEvent;

public class GameFinishedEvent extends GwtEvent<GameFinishedEventHandler>{

	public static Type<GameFinishedEventHandler> TYPE = new Type<GameFinishedEventHandler>();
	
	@Override
	protected void dispatch(GameFinishedEventHandler handler) {
		handler.onGameFinished(this);
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<GameFinishedEventHandler> getAssociatedType() {
		return TYPE;
	}

}
