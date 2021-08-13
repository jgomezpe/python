package python;

import aplikigo.process.ProcessRunner;
import aplikigo.process.ProcessServer;

public class PythonServer extends ProcessServer{
    protected ProcessRunner python = null;
    public PythonServer(String name) { super(name); }
    
    @Override
    public ProcessRunner process() { 
	python = new PythonCodeRunner(); 	
	return python;
    }    
    
    @Override
    public String init(String command) {
	String response = "";
	while( !response.endsWith(">>> ") ) {
	    response += inner_pull("");
	    try { Thread.sleep(300); } 
	    catch (InterruptedException e) { e.printStackTrace(); }
	}
	command = PythonCodeRunner.wrap(command);
	input(command);
	return response;
    }
 }
