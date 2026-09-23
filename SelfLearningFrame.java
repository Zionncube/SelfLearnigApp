import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.GridLayout;
import java.io.IOException;
import java.time.LocalDate;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.SwingConstants;

public class SelfLearningFrame extends JFrame {
    private static final Color NAVY = new Color(37, 55, 92);
    private static final Color BLUE = new Color(110, 180, 235);
    private static final Color GREEN = new Color(125, 196, 155);
    private static final Color YELLOW = new Color(249, 205, 105);
    private static final Color PINK = new Color(241, 160, 183);

    private final JTextArea display = new JTextArea();
    private final LearningTopic[] topics = {
        new LearningTopic(1, "Your amazing brain", "Your brain changes when you practise.",
            "Your brain is not fixed. When you practise a skill, your brain strengthens the pathways it uses. This is called neuroplasticity. Learning takes time, and small improvements count."),
        new LearningTopic(2, "Mistakes are information", "Mistakes can point you to your next step.",
            "A mistake does not mean you cannot learn. It gives you information: what was difficult, what you need to practise, or which strategy to change. Try asking: What can I do differently next time?"),
        new LearningTopic(3, "Focus and attention", "Attention can be trained and protected.",
            "Focus is easier when distractions are lower. You could try a quiet place, a short timer, putting your phone away, or taking a short movement break. Notice which option helps you most."),
        new LearningTopic(4, "Stress and rest", "Rest is part of learning, not a reward after it.",
            "When stress is high, thinking can feel harder. Slow breathing, a short break, sleep, water, and asking for help can make learning more manageable. Taking care of yourself supports your brain."),
        new LearningTopic(5, "Different learning needs", "People can need different supports to learn well.",
            "Some people learn best by reading, drawing, listening, talking through an idea, or practising. Some prefer quiet; others benefit from movement. There is no single best method for everyone. Test what works for you."),
        new LearningTopic(6, "Setting a useful goal", "A useful goal is small, clear, and possible to practise.",
            "Instead of saying 'I will get better at maths', try 'I will practise fractions for 15 minutes on Tuesday and Thursday'. A clear goal helps you notice progress and choose your next action.")
    };
    private Learner learner;

    public SelfLearningFrame() {
        learner = DataStorage.loadLearner();
        if (learner == null) learner = createLearner();
        setTitle("Self-Learning Journey");
        setSize(940, 680);
        setMinimumSize(new java.awt.Dimension(760, 560));
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        buildInterface();
        showWelcome();
    }

    private Learner createLearner() {
        String name = askRequired("Welcome to your Self-Learning Journey!\n\nWhat name would you like to use?");
        if (name == null) name = "Learner";
        Integer enteredAge = askNumber("How old are you?", 10, 15);
        int age = enteredAge == null ? 10 : enteredAge;
        Learner newLearner = new Learner(1, name, age);
        DataStorage.saveLearner(newLearner);
        return newLearner;
    }

    private void buildInterface() {
        getContentPane().removeAll();
        setLayout(new BorderLayout(12, 12));
        getContentPane().setBackground(new Color(246, 248, 252));

        JPanel heading = new JPanel(new BorderLayout());
        heading.setBackground(NAVY);
        heading.setBorder(BorderFactory.createEmptyBorder(16, 20, 16, 20));
        JLabel title = new JLabel(t("My Self-Learning Journey", "Uhambo Lwami Lokuzifundela"));
        title.setForeground(Color.WHITE);
        title.setFont(new Font("SansSerif", Font.BOLD, 28));
        JLabel subtitle = new JLabel(t("Notice • Try • Reflect • Grow", "Qaphela • Zama • Cabanga • Khula"));
        subtitle.setForeground(new Color(220, 232, 250));
        subtitle.setFont(new Font("SansSerif", Font.PLAIN, 16));
        heading.add(title, BorderLayout.NORTH);
        heading.add(subtitle, BorderLayout.SOUTH);
        add(heading, BorderLayout.NORTH);

        display.setEditable(false);
        display.setFont(new Font("SansSerif", Font.PLAIN, 17));
        display.setForeground(new Color(35, 45, 60));
        display.setBackground(Color.WHITE);
        display.setLineWrap(true);
        display.setWrapStyleWord(true);
        display.setMargin(new java.awt.Insets(22, 24, 22, 24));
        add(new JScrollPane(display), BorderLayout.CENTER);

        JPanel buttons = new JPanel(new GridLayout(0, 3, 9, 9));
        buttons.setBackground(new Color(246, 248, 252));
        buttons.setBorder(BorderFactory.createEmptyBorder(4, 14, 16, 14));
        addButton(buttons, t("My Profile", "Iphrofayili Yami"), BLUE, this::editProfile);
        addButton(buttons, t("Brain Lab", "Ilabhorethri Yobuchopho"), YELLOW, this::showTopicPicker);
        addButton(buttons, t("Context Map", "Imephu Yesimo"), GREEN, this::editResourceMap);
        addButton(buttons, t("Observer View", "Ukubuka Ngokucophelela"), PINK, this::recordObservation);
        addButton(buttons, t("Try a Strategy", "Zama Isu"), BLUE, this::recordExperiment);
        addButton(buttons, t("Reflect & Learn", "Cabanga Futhi Ufunde"), GREEN, this::recordReflection);
        addButton(buttons, t("Gratitude", "Ukubonga"), YELLOW, this::recordGratitude);
        addButton(buttons, t("My Evidence Journey", "Uhambo Lwami Lobufakazi"), PINK, this::showGrowth);
        addButton(buttons, t("Starting Check-In", "Ukuhlola Kokuqala"), BLUE, () -> completeEvaluation(true));
        addButton(buttons, t("Finish Check-In", "Ukuhlola Kokugcina"), GREEN, () -> completeEvaluation(false));
        addButton(buttons, t("My Confidence Results", "Imiphumela Yami"), YELLOW, this::showEvaluationResults);
        addButton(buttons, t("Teacher Summary", "Isifinyezo Sikathisha"), PINK, this::showTeacherSummary);
        addButton(buttons, t("English / isiZulu", "isiZulu / English"), BLUE, this::toggleLanguage);
        add(buttons, BorderLayout.SOUTH);
    }

    private void addButton(JPanel panel, String text, Color color, Runnable action) {
        JButton button = new JButton(text);
        button.setBackground(color);
        button.setFont(new Font("SansSerif", Font.BOLD, 14));
        button.setFocusPainted(false);
        button.setBorder(BorderFactory.createEmptyBorder(11, 8, 11, 8));
        button.addActionListener(event -> action.run());
        panel.add(button);
    }

    private void showWelcome() {
        display.setText(t("Hi " + learner.getName() + "!\n\n"
            + "This is a space to explore how you learn. Learn a brain principle, step back into Observer View, test a strategy, gather evidence, and decide what to do next.\n\n"
            + "There are no perfect answers here. The goal is to understand yourself with curiosity, not judgement.",
            "Sawubona " + learner.getName() + "!\n\n"
            + "Lena yindawo yokuhlola indlela ofunda ngayo. Funda ngomqondo wobuchopho, zibuke ngokucophelela, zama isu, qoqa ubufakazi, bese ukhetha ozokwenza ngokulandelayo.\n\n"
            + "Azikho izimpendulo eziphelele lapha. Umgomo ukuzazi ngokufuna ukwazi, hhayi ngokuzahlulela."));
    }

    private void toggleLanguage() {
        learner.setIsiZulu(!learner.isIsiZulu());
        DataStorage.saveLearner(learner);
        buildInterface();
        revalidate();
        repaint();
        showWelcome();
    }

    private String t(String english, String zulu) {
        return learner != null && learner.isIsiZulu() ? zulu : english;
    }

    private void editProfile() {
        Profile old = learner.getProfile();
        String interests = askRequired("What subjects, activities, or topics interest you?", value(old, 1));
        String strengths = askRequired("What are you already good at when learning?", value(old, 2));
        String challenges = askRequired("What can feel difficult when you are learning?", value(old, 3));
        String environment = askRequired("What kind of place or routine helps you learn best?", value(old, 4));
        String goals = askRequired("What is one small learning goal you have?", value(old, 5));
        if (interests == null || strengths == null || challenges == null || environment == null || goals == null) return;
        learner.setProfile(new Profile(interests, strengths, challenges, environment, goals));
        save("Your profile has been saved.");
        display.setText("MY PROFILE\n\nInterests: " + interests + "\n\nStrengths: " + strengths + "\n\nChallenges: " + challenges
            + "\n\nHelpful environment: " + environment + "\n\nMy goal: " + goals);
    }

    private String value(Profile profile, int item) {
        if (profile == null) return "";
        if (item == 1) return profile.getInterests();
        if (item == 2) return profile.getStrengths();
        if (item == 3) return profile.getChallenges();
        if (item == 4) return profile.getLearningEnvironment();
        return profile.getGoals();
    }

    private void showTopicPicker() {
        String[] titles = new String[topics.length];
        for (int i = 0; i < topics.length; i++) titles[i] = topics[i].getTitle();
        String selected = (String) JOptionPane.showInputDialog(this, "Choose a topic to explore:", "Explore Topics", JOptionPane.PLAIN_MESSAGE, null, titles, titles[0]);
        if (selected == null) return;
        for (LearningTopic topic : topics) {
            if (topic.getTitle().equals(selected)) {
                String content = learner.isIsiZulu() ? zuluTopic(topic) : topic.getContent();
                display.setText(topic.getTitle().toUpperCase() + "\n\n" + content
                    + "\n\n" + t("Try this: use Observer View to notice when this idea appears in your own learning.", "Zama lokhu: sebenzisa Ukubuka Ngokucophelela ukuze uqaphele lapho lo mbono uvela ekufundeni kwakho."));
                return;
            }
        }
    }

    private String zuluTopic(LearningTopic topic) {
        switch (topic.getTitle()) {
            case "Your amazing brain": return "Ubuchopho bakho bungashintsha lapho uzijwayeza ikhono. Lokhu kubizwa nge-neuroplasticity. Lapho uphinda uzama, izindlela ezisetshenziswa ubuchopho ziyaqina. Ukufunda kuthatha isikhathi; nentuthuko encane ibalulekile.";
            case "Mistakes are information": return "Iphutha alisho ukuthi awukwazi ukufunda. Lisinika ulwazi ngalokho okunzima, okudinga ukuzijwayeza noma isu okumele liguqulwe. Buza: Ngingenzani ngendlela ehlukile ngokuzayo?";
            case "Focus and attention": return "Ukugxila kuba lula lapho iziphazamiso zinciphile. Zama indawo ethule, isibali-sikhathi esifushane, ukubeka ifoni kude noma ikhefu lokunyakaza. Qaphela okusizayo.";
            case "Stress and rest": return "Uma ukucindezeleka kuphezulu, ukucabanga kungaba nzima. Ukuphefumula kancane, ikhefu, ukulala, amanzi, nokucela usizo kungenza ukufunda kube lula.";
            case "Different learning needs": return "Abantu bangadinga ukwesekwa okuhlukile. Abanye basizwa ukufunda, ukulalela, ukudweba, ukuxoxa noma ukuzijwayeza. Akukho ndlela eyodwa elungele wonke umuntu. Hlola okukusebenzelayo.";
            default: return "Umgomo ocacile mncane futhi uyasebenziseka. Esikhundleni soku 'Ngizoba ngcono ezibalweni', zama 'Ngizozijwayeza izingxenyana imizuzu eyi-15 ngoLwesibili nangoLwesine'.";
        }
    }

    private void showLearningDifferences() {
        display.setText(t("LEARNING DIFFERENCES\n\nYou do not need to learn exactly like anyone else. "
            + "You might understand ideas through reading, diagrams, discussion, listening, or practice. You may also need quiet, movement, structure, breaks, or extra time.\n\n"
            + "The useful question is not 'Which type of learner am I forever?' It is 'What support helps me with this task today?'\n\n"
            + "Use Try a Strategy to test one support and see what happens.",
            "UMEHLUKO EKUFUNDENI\n\nAwudingi ukufunda ngendlela efana ncamashi neyomunye umuntu. Ungaqonda imibono ngokufunda, imidwebo, ingxoxo, ukulalela noma ukuzijwayeza. Ungase futhi udinge ukuthula, ukunyakaza, ukuhleleka, amakhefu noma isikhathi esengeziwe.\n\n"
            + "Umbuzo owusizo awuthi 'Ngiluhlobo luni lomfundi phakade?' Uthi 'Yikuphi ukwesekwa okungisiza kulo msebenzi namuhla?'\n\n"
            + "Sebenzisa Zama Isu ukuze uhlole ukwesekwa okukodwa ubone okwenzekayo."));
    }

    private void editResourceMap() {
        ResourceMap old = learner.getResourceMap();
        String helpful = askRequired(t("What conditions help you learn or feel settled?", "Yiziphi izimo ezikusiza ufunde noma uzizwe uzolile?"), old == null ? "" : old.getHelpfulConditions());
        String distractions = askRequired(t("What around you makes learning harder?", "Yini ekuzungezile eyenza ukufunda kube nzima?"), old == null ? "" : old.getDistractions());
        String resources = askRequired(t("Which people, spaces, tools, or routines could support you?", "Yibaphi abantu, izindawo, amathuluzi noma izindlela ezingakusiza?"), old == null ? "" : old.getPeopleAndTools());
        String next = askRequired(t("Which support will you use or create next?", "Yikuphi ukwesekwa ozokusebenzisa noma ozokudala ngokulandelayo?"), old == null ? "" : old.getNextSupport());
        if (helpful == null || distractions == null || resources == null || next == null) return;
        learner.setResourceMap(new ResourceMap(helpful, distractions, resources, next));
        save(t("Your context map was saved.", "Imephu yakho yesimo ilondoloziwe."));
        display.setText(t("MY CONTEXT MAP\n\nWhat helps me: " + helpful + "\n\nWhat gets in the way: " + distractions + "\n\nResources I can use: " + resources + "\n\nMy next support: " + next,
            "IMEPHU YAMI YESIMO\n\nOkungisizayo: " + helpful + "\n\nOkungenza kube nzima: " + distractions + "\n\nIzinsiza engingazisebenzisa: " + resources + "\n\nUkwesekwa kwami okulandelayo: " + next));
    }

    private void recordObservation() {
        String scene = askRequired(t("Observer View: Imagine a kind camera watching you. What would it have seen you doing?", "Ukubuka Ngokucophelela: Cabanga ngekhamera enomusa ikubuka. Ibizokubona wenzani?"));
        String signals = askRequired(t("What thoughts, feelings, or body signals did you notice?", "Yimiphi imicabango, imizwa noma izimpawu zomzimba oziqaphelile?"));
        String context = askRequired(t("What was happening around you at that time?", "Bekwenzekani eduze kwakho ngaleso sikhathi?"));
        String next = askRequired(t("What might this learner need or try next?", "Lo mfundi angadingani noma angazama ini ngokulandelayo?"));
        if (scene == null || signals == null || context == null || next == null) return;
        String text = "Observer View\nScene: " + scene + "\nSignals: " + signals + "\nContext: " + context + "\nNext possibility: " + next;
        learner.addObservation(new Observation(learner.getObservations().size() + 1, text, LocalDate.now()));
        save(t("Thoughtful observation saved.", "Ukubuka kwakho okulalelisisayo kulondoloziwe."));
        display.setText(t("OBSERVER VIEW SAVED\n\nYou described the scene, inner signals, and context before choosing a next step. That is useful personal evidence.",
            "UKUBUKA NGOKUCOPOPHELA KULONDOLOZIWE\n\nUchaze okwenzekile, izimpawu zangaphakathi nesimo ngaphambi kokukhetha isinyathelo esilandelayo. Lobu ubufakazi bomuntu siqu obuwusizo."));
    }

    private void recordExperiment() {
        String difficulty = askRequired(t("What would you like to make easier or improve?", "Yini ofuna ukuyenza ibe lula noma uthuthuke kuyo?"));
        if (difficulty == null) return;
        String other = t("Use a different strategy", "Sebenzisa isu elihlukile");
        String[] choices = {t("Work in a quieter space", "Sebenzela endaweni ethule"), t("Use a 15-minute focus timer", "Sebenzisa isibali-sikhathi semizuzu eyi-15"), t("Take a short movement break", "Thatha ikhefu elifushane lokunyakaza"), t("Break the task into smaller steps", "Hlukanisa umsebenzi ube yizinyathelo ezincane"), t("Ask for help", "Cela usizo"), other};
        String strategy = (String) JOptionPane.showInputDialog(this, t("Choose a strategy to test:", "Khetha isu ozolihlola:"), t("Try a Strategy", "Zama Isu"), JOptionPane.PLAIN_MESSAGE, null, choices, choices[0]);
        if (strategy == null) return;
        if (strategy.equals(other)) strategy = askRequired(t("What strategy will you try?", "Yiliphi isu ozolizama?"));
        if (strategy == null) return;
        String prediction = askRequired(t("What do you think might happen if you try this?", "Ucabangani ukuthi kungenzeka uma uzama lokhu?"));
        String result = askRequired(t("What happened after you tried it?", "Kwenzekeni ngemva kokuzama?"));
        if (prediction == null || result == null) return;
        learner.addExperiment(new Experiment(learner.getExperiments().size() + 1, strategy, difficulty, prediction, result, LocalDate.now()));
        save(t("Your strategy experiment is saved.", "Ukuhlola kwakho isu kulondoloziwe."));
        display.setText(t("STRATEGY EXPERIMENT\n\nChallenge: " + difficulty + "\nStrategy: " + strategy + "\nPrediction: " + prediction + "\nResult: " + result,
            "UKUHLOLA ISU\n\nInselelo: " + difficulty + "\nIsu: " + strategy + "\nOkulindelekile: " + prediction + "\nUmphumela: " + result));
        if (JOptionPane.showConfirmDialog(this, t("Would you like to reflect on what you learned now?", "Ungathanda ukucabanga ngalokho okufundile manje?"), t("Reflect", "Cabanga"), JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) recordReflection();
    }

    private void recordReflection() {
        String thoughts = askRequired(t("What were you thinking?", "Ubucabangani?"));
        String feelings = askRequired(t("What were you feeling?", "Ubuzizwa kanjani?"));
        String lesson = askRequired(t("What did you learn about yourself or your strategy?", "Ufunde ukuthini ngawe noma ngecebo lakho?"));
        if (thoughts == null || feelings == null || lesson == null) return;
        learner.addReflection(new Reflection(learner.getReflections().size() + 1, thoughts, feelings, lesson, LocalDate.now()));
        save(t("Reflection saved. Well done for thinking it through.", "Ukucabanga kwakho kulondoloziwe. Wenze kahle ngokukucabangisisa."));
        display.setText(t("REFLECTION\n\nThoughts: " + thoughts + "\nFeelings: " + feelings + "\n\nWhat I learned: " + lesson,
            "UKUCABANGA\n\nImicabango: " + thoughts + "\nImizwa: " + feelings + "\n\nEngikufundile: " + lesson));
    }

    private void recordGratitude() {
        String message = askRequired(t("What is one person, moment, skill, or thing you appreciate today?", "Ubani, yisiphi isikhathi, ikhono noma into oyibonga namuhla?"));
        if (message == null) return;
        learner.addGratitudeEntries(new GratitudeEntry(learner.getGratitudeEntries().size() + 1, message, LocalDate.now()));
        save("Gratitude entry saved.");
        display.setText("GRATITUDE\n\n" + message + "\n\nTaking a moment to notice positive things can support wellbeing.");
    }

    private void showGrowth() {
        StringBuilder text = new StringBuilder(t("MY EVIDENCE JOURNEY\n\n", "UHAMBO LWAMI LOBUFAKAZI\n\n"));
        text.append(t("This is not a score. It is a record of patterns, strategies, and insights you can use.\n\n", "Lokhu akusona isikolo. Kungumlando wamaphethini, amasu nemibono ongayisebenzisa.\n\n"));
        text.append("Observations: ").append(learner.getObservations().size()).append("\n");
        text.append("Strategies tested: ").append(learner.getExperiments().size()).append("\n");
        text.append("Reflections: ").append(learner.getReflections().size()).append("\n");
        text.append("Gratitude entries: ").append(learner.getGratitudeEntries().size()).append("\n\n");
        if (!learner.getReflections().isEmpty()) text.append("Latest insight: ").append(learner.getReflections().get(learner.getReflections().size() - 1).getLessonLearned());
        else text.append("Your first insight will appear after you add a reflection.");
        display.setText(text.toString());
    }

    private void completeEvaluation(boolean before) {
        String[] questions = {
            "I know what helps me concentrate.",
            "When I get stuck, I can think of a strategy to try.",
            "I think about what worked after I learn.",
            "I understand that practice can strengthen learning."
        };
        int[] responses = new int[questions.length];
        for (int i = 0; i < questions.length; i++) {
            Integer response = askNumber(questions[i] + "\n\n1 = Strongly disagree     5 = Strongly agree", 1, 5);
            if (response == null) return;
            responses[i] = response;
        }
        EvaluationRecord evaluation = learner.getEvaluationRecord();
        if (evaluation == null) evaluation = new EvaluationRecord();
        if (before) evaluation.setBeforeResponses(responses); else evaluation.setAfterResponses(responses);
        learner.setEvaluationRecord(evaluation);
        save("Your check-in has been saved.");
        display.setText("CHECK-IN COMPLETE\n\nYour answers are private in this app. They help show whether using the app supports confidence and self-awareness over time.");
    }

    private void showEvaluationResults() {
        EvaluationRecord evaluation = learner.getEvaluationRecord();
        if (evaluation == null || !evaluation.hasBeforeResponses()) {
            display.setText("MY CONFIDENCE RESULTS\n\nStart with the Starting Check-In. Later, complete the Finish Check-In so you can compare your answers.");
            return;
        }
        String text = "MY CONFIDENCE RESULTS\n\nStarting check-in: " + format(evaluation.getBeforeAverage()) + " / 5\n";
        if (evaluation.hasAfterResponses()) text += "Finish check-in: " + format(evaluation.getAfterAverage()) + " / 5\nChange: " + format(evaluation.getImprovement()) + " points\n\nA positive change can suggest that you feel more aware of the strategies that help you learn.";
        else text += "\nComplete the Finish Check-In after using the app for a while to compare results.";
        display.setText(text);
    }

    private void showTeacherSummary() {
        String text = "TEACHER / PARENT SUMMARY\n\nLearner: " + learner.getName() + " (age " + learner.getAge() + ")\n"
            + "Observations: " + learner.getObservations().size() + "\nExperiments: " + learner.getExperiments().size() + "\nReflections: " + learner.getReflections().size() + "\nGratitude: " + learner.getGratitudeEntries().size() + "\n\n"
            + "This is a basic progress summary. Discuss entries with the learner respectfully; the aim is support, not judgement.";
        display.setText(text);
        if (JOptionPane.showConfirmDialog(this, "Would you like to save this summary as a text report?", "Export report", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) {
            try {
                String path = ReportExporter.export(learner);
                JOptionPane.showMessageDialog(this, "Report saved to:\n" + path, "Report saved", JOptionPane.INFORMATION_MESSAGE);
            } catch (IOException error) {
                JOptionPane.showMessageDialog(this, "The report could not be saved.", "Save problem", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private String format(double number) { return String.format("%.2f", number); }

    private void save(String message) {
        DataStorage.saveLearner(learner);
        JOptionPane.showMessageDialog(this, message, "Saved", JOptionPane.INFORMATION_MESSAGE);
    }

    private String askRequired(String question) { return askRequired(question, ""); }

    private String askRequired(String question, String previousValue) {
        String answer = JOptionPane.showInputDialog(this, question, previousValue);
        if (answer == null) return null;
        answer = answer.trim();
        if (answer.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter an answer.", "Missing answer", JOptionPane.WARNING_MESSAGE);
            return askRequired(question, previousValue);
        }
        return answer;
    }

    private Integer askNumber(String question, int minimum, int maximum) {
        while (true) {
            String answer = JOptionPane.showInputDialog(this, question);
            if (answer == null) return null;
            try {
                int value = Integer.parseInt(answer.trim());
                if (value >= minimum && value <= maximum) return value;
            } catch (NumberFormatException error) {
                // The learner receives the clear message below.
            }
            JOptionPane.showMessageDialog(this, "Enter a whole number from " + minimum + " to " + maximum + ".", "Try again", JOptionPane.WARNING_MESSAGE);
        }
    }
}
