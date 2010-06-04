function removeFromArray(a, element){
    pos = -1;
    for (var i = 0; i < a.length; i++) {
        if (a[i] == element) {
            pos = i;
            break;
        }
    }
    if (pos >= 0) {
        for (var i = pos; i < a.length - 1; i++) {
        	a[i]=a[i+1];
        }
		a.pop();
    }
}
