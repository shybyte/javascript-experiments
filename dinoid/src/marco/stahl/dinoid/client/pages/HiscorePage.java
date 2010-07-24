package marco.stahl.dinoid.client.pages;

import marco.stahl.dinoid.client.pages.event.StartPageEvent;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class HiscorePage extends Composite {

	private static HiscorePageUiBinder uiBinder = GWT
			.create(HiscorePageUiBinder.class);

	interface HiscorePageUiBinder extends UiBinder<Widget, HiscorePage> {
		// gwt magic
	}

	@UiField
	Button button;
	private final HandlerManager eventBus;

	public HiscorePage(HandlerManager eventBus) {
		this.eventBus = eventBus;
		initWidget(uiBinder.createAndBindUi(this));
	}

	@UiHandler("button")
	void onClick(@SuppressWarnings("unused") ClickEvent e) {
		eventBus.fireEvent(new StartPageEvent());
	}

}
