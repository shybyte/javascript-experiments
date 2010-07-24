package marco.stahl.dinoid.client.pages.event;

import com.google.gwt.event.shared.GwtEvent;

public class StartPageEvent extends GwtEvent<StartPageEventHandler> {

	public static final Type<StartPageEventHandler> TYPE = new Type<StartPageEventHandler>();

	@Override
	protected void dispatch(StartPageEventHandler handler) {
		handler.onStartPage(this);
	}

	@Override
	public com.google.gwt.event.shared.GwtEvent.Type<StartPageEventHandler> getAssociatedType() {
		return TYPE;
	}

}
