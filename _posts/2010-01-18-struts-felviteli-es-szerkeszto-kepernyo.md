---
layout: post
title: Struts felviteli és szerkesztő képernyő
date: '2010-01-18T23:35:00.007+01:00'
author: István Viczián
tags:
- Struts
modified_time: '2018-06-09T10:00:00.000-08:00'
---

A legtöbb projektünkben ugyan Spring MVC-t használunk, de van egy-két
régebbi alkalmazás, melyet Struts-ban (még nem Struts 2-ben)
fejlesztünk. Gyakran vissza kell hozzá nyúlni, és mindig keresgélnem
kell, hogy hogyan is kell a képernyőket felépíteni, ígyhát inkább leírom
ide, hátha másnak is hasznára válik.

Ezen probléma ismerős lehet más webes keretrendszereknél is, és
lehetséges, mint pl. a Spring MVC esetén, hogy sokkal szofisztikáltabb
megoldást adnak rá, mégis érdemes az alapelvekkel tisztában lenni. A
bonyolultabb, komponens alapú keretrendszereknél, mint JSF vagy Wicket,
már kevésbé kell ennyire a kérésekkel/válaszokkal foglalkozni.

Egy CRUD (Create-Read-Update-Delete) alkalmazást tipikus
képernyőfolyama, mikor a felhasználó a listázó képernyőről indul. Itt
vagy új tételt vesz fel, vagy kiválaszt egy tételt módosításra, vagy
töröl egy tételt. Az első két esetben mindenképp megjelenik egy űrlap
(form), az első esetben üresen, módosítás esetén már feltöltve
adatokkal. Az űrlapot elküldve megtörténik a mentés, visszakerül a
felhasználó a listázó képernyőre, valamilyen üzenettel.

![Struts képernyők](/artifacts/posts/2010-01-18-struts-felviteli-es-szerkeszto-kepernyo/struts_kepernyok_b.png)

A [szakirodalom](http://wiki.apache.org/struts/DataEntryForm) ezt
DataEntryForm-nak nevezi. Két fázisból áll, ahol az első fázis az űrlap
megjelenítése (render/output/setup phase), a második fázis az elküldött
űrlap feldolgozása (post/submit phase). Az első fázis az alapján dönti
el, hogy új felvitel, vagy módosítás van, hogy URL paraméterben kapott-e
valamilyen tétel azonosítót (id). Nézzük a felviteli/módosító képernyőt,
hogy hogyan érdemes megvalósítani.

A következő követelményeket sorolhatjuk fel:

-   Az oldal http GET-re, ha nem kap id-t, adja vissza az űrlapot
-   Az oldal http GET-re, ha id-t kap, kitöltve visszaadja az űrlapot
-   Mindkét esetben a megjelenítendő, űrlapot tartalmazó oldalt fel kell
    készíteni, feltölteni dinamikus adatokkal
-   Az oldal http POST-ra (az űrlap elküldésekor, POST metódust
    használunk, hiszen a szerver oldalon történik üzleti adat
    változtatás) lefuttatja az ellenőrzéseket
-   Amennyiben az ellenőrzés nem sikerül, újra kapjuk vissza az űrlapot,
    és különösen fontos, hogy a kitöltött értékekkel, a hibásakat
    megjelölve
-   Amennyiben az ellenőrzés sikerül, a redirect after post elv szerint
    átirányítás történjen egy másik oldalra, amin meg kell jeleníteni a
    művelet eredményét (sikeres mentés)

Sajnos a Struts nem ad arra tanácsot, hogy hogyan lehetne ezen
összefüggő oldalakat egyszerűen megvalósítani, inkább az oldalakat külön
egységnek tekinti.

A Struts belső logikáját és osztályait kevésbé ismerve a feladatot
megoldhatjuk úgy, hogy külön Action-t veszünk fel az űrlap
alapértékekkel való feltöltésére, és külön Action-t veszünk fel, ami a
POST-ot feldolgozza, két külön URL-len. Akár mindegyikhez külön
ActionForm-ot is készíthetünk.

Ennek a megközelítésnek több problémája is van:

-   Két Action osztály, a logika szétszórva, két külön URL, két
    bejegyzés a struts-config.xml-ben.
-   A legtöbb probléma az adatok ellenőrzésénél van. Ha az ellenőrzés
    elbukik, és a Struts autovalidation van bekapcsolva, az csak JSP
    oldalra tud vinni. Ebben az esetben viszont nem hívódik meg az a
    kód, ami az űrlap előkészítésekor az első Action-ben van. Ilyenek
    pl. azon elemek feltöltése, melyek nem szerepelnek a Form-ban. Az
    űrlap az első fázisban más URL-en szerepel, mint hibás esetben.

Ahhoz, hogy hatékonyabb megoldást találjunk, a következőket érdemes
megfogadni:

-   Használjuk az
    [EventActionDispatcher](http://wiki.apache.org/struts/EventActionDispatcher)
    osztályt. Ezt használva egy Action-be több metódust is
    implementálhatunk, és a Dispatcher a struts-config.xml-ben lévő
    parameter attribútum értéke alapján a megfelelő metódust hívja meg.
    Pontosan ez úgy történik, hogy definiálhatjuk, hogy amennyiben egy
    paraméter szerepel a kérésben, vagy egy megadott paraméter a
    megadott értéket veszi fel, mely metódus kerüljön meghívásra.
    Különösen több gomb esetén érdemes használni.
-   Az űrlap kizárólag az ActionForm adatai alapján töltődjön fel, nem
    érdemes mindenféle request vagy session attribútumokat használni.
    Használhatjuk a ActionForm-ot az első fázis paramétereinek
    értelmezésére is, pl. a tétel azonosítójának tárolására. Minden
    esetben a Struts példányosítja az ActionForm-ot, ha a
    struts-config.xml-ben szerepel a name attribútum. Ezt a
    példányosított ActionForm-ot tölthetjük fel utána értékkel.
-   Az autovalidation-t ajánlott kikapcsolni, és manuálisan hívni az
    ellenőrzést. Az autovalidation során az irányítás kicsúszik a
    kezünkből, és hiba esetén a struts-config.xml-ben megadott input
    attribútumban definiált JSP-re kerülhet csak a vezérlés. Ha mi
    végezzük az ellenőrzést, akkor dönthetünk másképp is, a legtöbb
    esetben nem elég a JSP, a hozzá tartozó Action-t is le kell
    futtatnunk.
-   Amennyiben az ellenőrzés elbukik, vissza kell irányítani a
    felhasználót az űrlapra. Ajánlott az Action-re, és nem a view-ra
    (JSP), így az Action elő tudja készíteni az űrlapot tartalmazó
    oldalt. Az Action a getErrors metódussal tudja eldönteni, hogy a
    hiba ágon van-e épp a vezérlés. Az átirányítás történhet
    forward-dal, de történhet redirect-tel is. Az előbbi esetén a
    felhasználó ha frissít a böngészőjében, az megerősítést fog kérin,
    az újra elküldésnél. Ez szerintem belefér, hiszen nem szokás egy
    ellenőrzés eredményét újratölteni. Ha mégis, használhatunk
    redirect-et is, de itt az ellenőrzés eredményét vagy URL-ben, vagy
    session-ben át kell adni. Ezeket a technikákat action reloading-nak
    nevezik.
-   Sikeres esetben mindig egy Action-re redirect-áljunk. A redirect
    after post elv miatt is hasznos (a böngészőben való frissítés esetén
    így nem küldi el újra az űrlapot, és a böngésző sem tesz fel
    kérdéseket, hogy újra akarjuk-e küldeni). Ezen kívül érdemes
    betartani az alapszabályt, hogy mindegyik view-hoz (JSP) tartozzon
    saját, dedikált Action, de egy Action-höz több view is tartozhat.
    Így egy 1:n kapcsolat alakul ki, nem érdemes egy view-hoz több
    Action-t is rendelni, hiszen az m:n kapcsolat már jóval
    átláthatatlanabb, és az Action-ökben kódduplikáláshoz vezethet.
-   Az előző következménye, hogy valahogy át kell a művelet eredményét
    adni a redirect során. Ez történhet URL paraméterrel (ActionForward
    használatával), vagy pl. a Struts képes az ActionMessages objektumot
    session-be is menteni, majd a standard módon, tag-gel onnan
    elővenni.

Figyeljünk arra, hogy a törlés is POST legyen, hiszen üzleti adatokat
módosít.

Nézzünk is meg egy példát, amikor van egy Employee osztályunk, és egy
olyan Action-t szeretnénk írni, mely képes vagy új Employee felvitelére,
vagy létező Employee módosítására.

Nézzük az Employee és ActionForm osztályokat:

{% highlight java %}
public class Employee {
private Long id;

private String name;

// Getter és setter metódusok
}

public class EmployeeForm extends ActionForm {
private Employee employee = new Employee();

private String saveButton;

@Override
public ActionErrors validate(ActionMapping mapping, HttpServletRequest request) {
   ActionErrors errors = new ActionErrors();
 if (StringUtils.isEmpty(employee.getName())) {
  errors.add("employee.name", new ActionMessage("empty_name"));
 }
 return errors;
}

// Getter és setter metódusok
}
{% endhighlight %}

Itt azt a trükköt érdemes megfigyelni, hogy az Employee osztályt
tartalmazó EmployeeForm-ot hoztunk létre, és ilyenkor az űrlapban a
employe.id és employe.name nevekkel hivatkozhatunk annak mezőire. A
validate metódus hibát ad vissza, ha a név üres.

Majd nézzük az Action osztályunkat:

{% highlight java %}
public class EmployeeAction extends Action {
private final static String VIEW = "view";
private final static String ERROR = "error";
private final static String SUCCESS = "success";

@Resource
private EmployeeService employeeService;

private ActionDispatcher dispatcher =
       new EventActionDispatcher(this);

@Override
public ActionForward execute(ActionMapping mapping, ActionForm form,
       HttpServletRequest request, HttpServletResponse response)
       throws Exception {
   if (getErrors(request) != null && !getErrors(request).isEmpty()) {
       return view(mapping, form, request, response);
   }
 else {
  return dispatcher.execute(mapping, form, request, response);
 }
}

public ActionForward view(ActionMapping mapping,
  ActionForm form,
       HttpServletRequest request,
       HttpServletResponse response)
       throws IOException, ServletException {
 if (((getErrors(request) == null) || getErrors(request).isEmpty()) &&  ((EmployeeForm) form).getEmployee().getId() != null) {
  ((EmployeeForm) form).setEmployee(employeeService.findEmployeeById());
 }
 return mapping.findForward(VIEW);
}

public ActionForward save(ActionMapping mapping,
       ActionForm form,
       HttpServletRequest request,
       HttpServletResponse response)
       throws IOException, ServletException {
 ActionErrors errors = form.validate(mapping, request);
 if (!errors.isEmpty()) {
       saveErrors(request, errors);
       return mapping.findForward(ERROR);
   }
 else {
  employeeService.saveEmployee(((EmployeeForm) form).getEmployee());
  ActionMessages messages = new ActionMessages();
  messages.add(null, new ActionMessage("successful_save"));
  saveMessages(request.getSession(), messages);
  return mapping.findForward(SUCCESS);
 }
}
}
{% endhighlight %}

Az EmployeeAction az Action leszármazottja, így implementálnia kell az
execute metódust. Ennek az első sora megvizsgálja, hogy hiba ágon
kerültünk-e erre az Action-re. Ha igen, a view() metódust hívja. A
továbbiakban használja az ActionDispatcher-t, hogy eldöntse, hogy melyik
metódust kell meghívni, ha nem hiba ágon vagyunk. A hiba ágat azért nem
bízhatjuk rá, mert a Form itt ki lesz töltve, hiszen az ellenőrzés ezen
futott, és ezért a save() metódusra vinne.

A view() metódus egyszerűen megvizsgálja, hogy a hiba ágon van-e. Ha nem
a hiba ágon van, és kapott paraméterben azonosítót, akkor betölt egy
Employee példányt, és beteszi az ActionForm-ba.

A save() metódus meghívja manuálisan az ellenőrzést, hiszen az
autovalidate ki van kapcsolva, és ha hibát talál, akkor az "error" nevű
átirányításra visz (ez nem a JSP, hanem az Action lesz a view ágon). Ha
nem talál hibát, elmenti az ActionFormba lévő Employee-t, és a
session-be tesz egy üzenetet a mentés sikerességéről.

Az Action-höz tartozó struts-config.xml részlet:

{% highlight xml %}
<form-bean name="EmployeeForm" type="jtechlog.EmployeeForm" />
...
<action path = "/employee"
name = "EmployeeForm"
type = "jtechlog.EmployeeAction"
parameter = "saveButton=save, default=view"
validate = "false"
scope = "request"
>
<forward name="view" path="/WEB-INF/jsp/employee.jsp" />
<forward name="error" path="/employee.do" />
<forward name="success" path="/listEmployees.do" redirect="true" />
</action>
{% endhighlight %}

Ez a konfiguráció definiálja az EmployeeAction Action-t, mely a
/employee.do címen érhető el új felvitel esetén, és /employee.do?id=1
címen módosítás esetén. Amennyiben a lekérés esetén a saveButton
paraméter ki van töltve, az EventActionDispatcher a save metódusra fog
vinni, egyébként a view metódusra. (Ide akár bármennyi metódust
felsorolhatnánk.) Az autovalidation ki van kapcsolva. Az ActionForm-ot
elegendő a request-be tenni, így erőforráskímélő is, mert nem kell a
session-be tenni.

Az employee.jsp állítja elő az űrlapot. Hibás esetben önmagát hívja meg
újra az Action. Sikeres esetben egy átirányítás történik a redirect
after post alapján, mely az üzenetet is meg fogja jeleníteni.

És végül lássuk a JSP részletet:

{% highlight xml %}
<html:form method="post" action="employee.do">
<html:errors />

<html:hidden property="employee.id" />
<html:text property="employee.name" />
<html:submit property="saveButton">Save</html:submit>
</html>
{% endhighlight %}

A teljes hívási láncot a következő szekvenciadiagram mutatja, mely három
részből áll. Első az űrlap lekérése (felvitel vagy módosítás), második
az űrlap elküldése hibákkal és a harmadik az űrlap elküldése hibák
nélkül.

<a href="/artifacts/posts/2010-01-18-struts-felviteli-es-szerkeszto-kepernyo/struts_szekvencia_b.png" data-lightbox="post-images">![UML szekvenciadiagram](/artifacts/posts/2010-01-18-struts-felviteli-es-szerkeszto-kepernyo/struts_szekvencia.png)</a>

Látható, hogy a Struts gyermekbetegséggekkel szenved, melyből sokat
tanultak a későbbi keretrendszerek fejlesztői.
