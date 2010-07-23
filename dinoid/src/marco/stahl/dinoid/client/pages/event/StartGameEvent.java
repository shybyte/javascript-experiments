package marco.stahl.dinoid.client.pages.event;


import com.google.gwt.event.shared.GwtEvent;

public class StartGameEvent extends GwtEvent<StartGameEventHandler>{

	public static final Type<StartGameEventHandler> TYPE = new Type<StartGameEventHandler>();
	
	@Override
	protected void dispatch(StartGameEventHandler handler) {
		handler.onStartGame(this);
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<StartGameEventHandler> getAssociatedType() {
		return TYPE;
	}

}
