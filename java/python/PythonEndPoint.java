package python;

import aplikigo.web.EndPoint;

public class PythonEndPoint extends EndPoint{
    /**
     * 
     */
    private static final long serialVersionUID = -7111285029745597832L;

    public PythonEndPoint() { 
	this.server = new PythonServer("PythonServer"); 
    }
}
