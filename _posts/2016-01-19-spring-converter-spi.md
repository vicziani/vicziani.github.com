---
layout: post
title: Spring Converter SPI
date: '2016-01-19T23:00:00.000+02:00'
author: István Viczián
---

A Spring Framework talán egyik legnagyobb előnye, hogy bizonyos gyakran használt funkcionalitásra egy frappáns megoldást biztosít, és ezt az egész keretrendszeren belül konzekvensen alkalmazza. Az egyik ilyen funkcionalitás a Spring Converter SPI.

Nagyon gyakran van szükség arra, hogy szöveges értékből egy objektumot gyártsunk. Szöveg szerepelhet sok helyen. Szerepelhet a Spring xml konfigurációjában, Spring Expression Language-ben (SpEL), valamint a HTTP protokoll is alapvetően szöveges. Azonban láthatjuk, hogy akár az xml konfigurációban alkalmazhatunk más, long, double, stb. típusú értékeket, valamint a Spring controllerekben is definiálhatunk ilyen típussal url paramétereket, path változókat, header bejegyzéseket, stb. A Spring a konverziót automatikusan elvégzi. De mi van akkor, ha mi nem ilyen gyakori típusokká akarjuk konvertálni a szövegeinket, hanem pl. egy saját osztály egy példányává.

A Spring nagyon könnyen bővíthető, és ezen konverziós mechanizmus mögött a Converter SPI áll, mely megengedi, hogy saját konvertereket implementáljunk. Sőt, ezeket a konvertereket igazán sok helyen használhatjuk is.

Ezen használati helyeket tekinti át ez a poszt, melyhez példaprogram is készült, és elérhető a [GitHubon](https://github.com/vicziani/jtechlog-spring-converters).

<!-- more -->

Példának vegyünk egy gázóra (`GasHour`) osztályt. Ennek a különlegessége, hogy 6:00 az első órája, és a nyári és téli időszámítás miatt létezik egy 23, és egy 25 órás gáznap is. Ennek szöveges reprezentációja pl. `2015-01-01 9.`, ami a 2015. január 1-ei gáznap 9. gázóráját jelenti.

Ez az osztály legyen valami hasonló:

{% highlight java %}
public class GasHour {

    private LocalDate date;

    private int hour;

    public static GasHour parse(String s) {
        // Szövegből GasHour példánnyá alakítás
    }
}
{% endhighlight %}


Az ehhez tartozó konverter nagyon egyszerű:

{% highlight java %}
public class GasHourConverter implements Converter<String, GasHour> {

    @Override
    public GasHour convert(String s) {
        return GasHour.parse(s);
    }
}
{% endhighlight %}

A konverter használatához definiáljunk egy `ConversionService` objektumot, és regisztráljuk a konvertert.

{% highlight xml %}
<bean id="conversionService"
        class="org.springframework.context.support.ConversionServiceFactoryBean">
    <property name="converters">
        <set>
            <bean class="jtechlog.springconverter.GasHourConverter"/>
        </set>
    </property>
</bean>
{% endhighlight %}

Vagy akár Java kódból:

{% highlight java %}
@Bean
public ConversionService conversionService() {
    ConversionServiceFactoryBean factoryBean =
        new ConversionServiceFactoryBean();
    factoryBean.setConverters(
        Collections.singleton(new GasHourConverter()));
    factoryBean.afterPropertiesSet();
    ConversionService conversionService = factoryBean.getObject();
    return conversionService;
}
{% endhighlight %}

Ezután az xml konfigurációban szereplő értékeket is fel tudja oldani.

{% highlight xml %}
<bean id="fooService"
        class="jtechlog.springconverter.FooService">
    <property name="startGasHour" value="2015-11-11 5." />
</bean>
{% endhighlight %}

Ha a beanünk implementációja a következő:

{% highlight java %}
public class FooService {

    private GasHour startGasHour;

    private void setStartGasHour(GasHour startGasHour) {
	    this.startGasGour = startGasHour;
    }
}
{% endhighlight %}

A konvertereket egyszerűen használhatjuk a `ConversionService` példányon keresztül is, nem kell a konkrét konverterre hivatkoznunk.

{% highlight java %}
@Autowired
public FooService(ConversionService conversionService) {
    this.conversionService = conversionService;
}

public void execute() {
    GasHour gasHour =
        conversionService.convert("2011-11-11 5.", GasHour.class);
}
{% endhighlight %}

Listákra nem kell külön konvertert írnunk, ugyanis képes a Spring kezelni, ha a listák elemeire van konverter. Azonban a Java furcsa generikus kezelése miatt ez nem triviális.

{% highlight java %}
List<GasHour> gasHours = (List<GasHour>) conversionService.convert(
        Arrays.asList("2011-11-11 5.", "2011-11-11 6.", "2011-11-11 7."),
        TypeDescriptor.collection(
                List.class, TypeDescriptor.valueOf(String.class)),
        TypeDescriptor.collection(
                List.class, TypeDescriptor.valueOf(GasHour.class)));
{% endhighlight %}

Nagyon szépen használható SpEL-ben is, az előbb említett `FooService` osztály esetén:

{% highlight xml %}
<bean id="fooService"
        class="jtechlog.springconverter.FooService">
    <property name="startGasHour" value="#{'2015-11-11 5.'}" />
</bean>
{% endhighlight %}

De természetesen programozottan is:

{% highlight java %}
StandardEvaluationContext evaluationContext =
    new StandardEvaluationContext();
StandardTypeConverter converter =
    new StandardTypeConverter(conversionService);
evaluationContext.setTypeConverter(converter);
ExpressionParser expressionParser = new SpelExpressionParser();
GasHour gasHour = expressionParser.parseExpression("2011-11-11 5.")
    .getValue(evaluationContext, GasHour.class);
assertThat(gasHour, is(GasHour.parse("2011-11-11 5.")));
{% endhighlight %}

Amennyiben Spring MVC-ben is használni szeretnénk, a konvertereket regisztrálhatjuk a
`WebMvcConfigurerAdapter`-ben is.

{% highlight java %}
@Configuration
@EnableWebMvc
public class WebAppConfig extends WebMvcConfigurerAdapter {
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new GasHourConverter());
    }
}
{% endhighlight %}

Ekkor controllerben is működik az automatikus konverzió:

{% highlight java %}
@Controller
public class GasHourController {

    @RequestMapping("/gashour")
    @ResponseBody
    public String getGasHour(@RequestParam GasHour gasHour) {
        return gasHour.toString();
    }
}
{% endhighlight %}

Még egy érdekesség, a Spring Data JPA is tudja használni, amikor egy lekérdezés eredményét, ami entitások listája, dto listákká akarjuk konvertálni. Ez akkor működik, ha a lapozást használjuk, és ehhez a visszatérési érték `Page` típus. Ebben a `map()` metódust kell hívni, a következőképpen.

{% highlight java %}
public Page<LocationDto> listLocations(Pageable pageable) {
    return locationDao.findAllOrderById(pageable)
        .map(new LocationConverter());
}
{% endhighlight %}

Az ehhez tartozó konverter:

{% highlight java %}
public class LocationConverter implements Converter<Location, LocationVO> {

    @Override
    public LocationVO convert(Location location) {
        LocationDto locationDto = new LocationDto();
        locationDto.id = location.getId();
        locationDto.lat = location.getLat();
        locationDto.lon = location.getLon();
        return locationDto;
    }
}
{% endhighlight %}
