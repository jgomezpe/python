package python;

import kerno.process.ProcessRunner;

/**
 * A Python interpreter (receives the python script to be run)
 */
public class PythonCodeRunner extends ProcessRunner{
    public static String wrap(String code) {
    	StringBuilder sb = new StringBuilder();
    	sb.append("exec(\"");
    	for( int i=0; i<code.length(); i++ ) {
    		switch(code.charAt(i)) {
    			case '"': sb.append("\\\""); break;
    			case '\n': sb.append("\\n"); break;
    			case '\r': sb.append("\\r"); break;
    			default: sb.append(code.charAt(i));
    		}
    	}
    	sb.append("\")\nquit()\n");
    	return sb.toString();
    }
    
    public PythonCodeRunner() {  super("python3 -i"); }
}
