//import
import java .time.LocalDate;

//class
public class Observation implements java.io.Serializable { 
    private static final long serialVersionUID = 1L;
    //Fields
    private int id;
    private String observation;
    private LocalDate date;
    
    //constructor
    public Observation(int id, String observation, LocalDate date) {
        this.id = id;
        this.observation = observation;
        this.date = date;
    }

    //methods
    public int getId() {
        return id;
    }

    public String getObservation() {
        return observation;
    }

    public LocalDate getDate() {
        return date;
    }
}
