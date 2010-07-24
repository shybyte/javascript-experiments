package marco.stahl.dinoid.client.pages;

import marco.stahl.dinoid.client.pages.event.StartGameEvent;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class StartPage extends Composite {
	private final HandlerManager eventBus;


	private static StartPageUiBinder uiBinder = GWT
			.create(StartPageUiBinder.class);

	interface StartPageUiBinder extends UiBinder<Widget, StartPage> {
		// GWT magic
	}

	@UiField
	Button startGameButton;

	
	public StartPage(HandlerManager eventBus) {
		this.eventBus = eventBus;
		initWidget(uiBinder.createAndBindUi(this));
		startGameButton.addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				onLogoClicked();
			}

		});
	}

	
	private void onLogoClicked() {
		eventBus.fireEvent(new StartGameEvent());
	}
}
