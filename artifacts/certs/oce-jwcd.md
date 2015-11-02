# Java EE 6 Web Component Developer Certified Expert Exam (1Z0-899) segédlet

* Java EE 6: Servlet 3.0, JSP 2.2, EL 2.2
* Java EE 7: Servlet 3.1, JSP 2.3, EL 3.0

## 1. fejezet: Networks and HTTP
- URI két megvalósulása: URL, URN
- HTTP/1.0-ban csak a `GET`, `POST`, `HEAD` definiált
- HTTP/1.1-ben: `GET`, `POST`, `HEAD`, `OPTIONS`, `PUT`, `DELETE`, `TRACE` (`CONNECT`: reserved)
- Státuszkódok: Informational (1xx), successful (2xx), Redirect (3xx), Client error (4xx), Server error (5xx)

## 2. fejezet: Java EE architecture

## 3. fejezet: Servlets
- `javax.servlet.Servlet` interface, `javax.servlet.GenericServlet` class, `javax.servlet.http.HttpServlet` class
- `HttpServlet`-et nem kötelezõ kiterjeszteni, írható Generic-cel is Http-t kezelõ servlet
- init hívásakor `ServletException` esetén van olyan konténer, mely megpróbálhatja újra példányosítani
- init hívásakor `UnavailableException extends ServletException`, megadhatjuk, hogy mennyi ideig áll fenn a probléma
- service esetén megfelelõen formázott `UnavailableException` - eltávolítja, permanent hiba esetén dobandó
- `ServletException`, vagy megfelelõen formázott `UnavailableException` esetén újra próbálkozhat

## 4. fejezet: Servlet Contexts
- `getContext` - más alkalmazás context-jét is képes visszaadni, a context-et kell átadni / jellel kezdve
- Nem lehet más context-bõl attribútumot lekérni

## 5. fejezet: Request and responses
- `getInputStream` és `getReader` együttes meghívása `IllegalStateException`-t dob
- Hossz beállítása `ServletResponse.setContentLength`
- `ServletRequestListener.requestInitialized`, `requestDestroyed`
- `flushBuffer` után a `setHeader` nem dob `IllegalStateException`-t, csak nem állítja be

## 6. fejezet: RequestDispatcher & Wrappers
- `include()`
- `forward()` elõtt nem lehet commit
- `forward()` visszatérése elõtt már elküldött, commitolt, lezárt a stream
- `javax.servlet.forward/include`: `request_uri`, `context_path`, `servlet_path`, `path_info`, `query_string ``
- `context_path` sohasem végzõdhet `/` jellel
- a `getNamedDispatcher` nem állítja be a `request_uri`, stb. paramétereket

## 7. fejezet: Filters

## 8. fejezet: Asynchronous requests
- `AsyncContext` `ServletRequest.startAsync()`
- `AsyncContext.dispatch()` hasonló, mint a `dispatcher.forward()`, de
 - dispatcher type `FORWARD` helyett `ASYNC`
 - buffer/header nem resetelõdik
 - commitált response-ra is meg lehet hívni, ha késõbb nem módosítják a headert
- `AsyncContext.ASYNC_CONTEXT_URI`, `ASYNC_CONTEXT_PATH`, `ASYNC_SERVLET_PATH`, `ASYNC_PATH_INFO`, `ASYNC_QUERY_STRING`
- `onStartAsync`, `onComplete`, `onTimeout`, `onError`
- a dispatch inkább egy include operációnak felel meg, azaz a hívó akár commitolhat is
- nem lehet dispatch-t kétszer ugyanazon az `AsyncContext`-en hívni

## 9. fejezet: Session Management
- `HttpSessionActivationListener.sessionDidActivate`, `sessionWillPassivate`
- `HttpSession.get/setMaxInactiveInterval`
- `HttpSessionAttributeListener` - `attributeAdded`, `attributeRemoved`, `attributeReplaced`
- `HttpSessionBindingListener`, ennek `valueBound` és `valueUnbound` metódusa van

## 10. fejezet: Application Deployment
- filter-mapping/dispatcher: `FORWARD`, `INCLUDE`, `REQUEST`, `ERROR`, és bejött az `ASYNC`
- `error-page/location`
- `javax.servlet.error.status_code`, `exception_type`, `message`, `exception`, `request_uri`, `servlet_name`
- sorrend: `listener`, `context`, `filter`, `servlet`

## 11. fejezet: Modular deployment
- `metadata-complete`: nincs scan
- `javax.servlet.annotation` package
- `@MultipartConfig`:  `fileSizeThreshold`, `maxFileSize`, `maxRequestSize`
- `META-INF/web-fragment.xml`
- `ordering`, `absolute-ordering`, `before`, `after`, `name`, `others`
- Ordering: `filter`, `servlet`, `ServletContextListener`, `ServletRequestListener`, `HttpSessionListener`, other listeners
- Programmatic registration: `servlet`, `filter`, `listener`
- Konfigurálni viszont csak `servlet`-et és `filter`-t lehet
- Több dolgot lehet beállítani dinamikusan regisztrált komponenseken
- `ServletRegistration.addMapping`
- `FilterRegistration.addMappingForServletNames`, `addMappingForUrlPatterns`
- `ServletContextListnerer contextInitialized` metódusában, vagy `ServletContainerInitializer` implementációban, mely a `META-INF/services/javax.servlet.ServletContainerInitializer`-ben van felvéve
- `onStartup(Set<Class<?>>, ServletContext)`
- van `enabled` tag a `servlet` tag-en belül
- elõször a web-fragment töltõdik be, majd az annotációk, és végül merge-ölõdik egyesével a `web.xml`-be

## 12. fejezet: Resource injection
- `javax.annotation.Resource`
- `javax.ejb.EJB`
- `javax.persistence`

## 13. fejezet: JSP Basics
- `taglib`, `uri`, `tagdir`
- `<%@include file=`
- `JspContext`, és ennek a leszármazottja a `PageContext`
- A tervezõk szerint a JSP nem csak servlet környezetben futtatható, de amennyiben abban fut, a `PageContext` példányt kapja
- `pageContext.forward`, `include`
- `jspInit`-ben az implicit objektumok nem érhetõek el
- implicit objektumok: `request`, `response`, `pageContext`, `session`, `application`, `out`, `config`, `page`, `exception`

## 14. fejezet: JSP Documents
- `jsp:root`, nem kötelezõ JSP 2.0-tól
- `jsp:expression`
- `jsp:directive.page`
- `jsp:directive.include`
- `jsp:declaration`
- `jsp:scriptlet`
- `jsp:text`
- `directive.page` file-t vár, mert statikus
- `CDATA`-n belül lévõt nem értelmezi
- parse-nál hiba, akkor validation fázisban dob hibát

## 15. fejezet: Expression Language
- nincs konkatenáció
- Precedencia

```
 [], .
 ()
 - (unary), not, !, empty
 *, /, div, %, mod
 +, -
 <, lt, >, gt, <=, le, >=, ge
 ==, eq, !=, ne
 &&, and
 ||, or
 ?:
```

- implicit objects: `pageContext`, `pageScope`, `requestScope`, `sessionScope`, `applicationScope`, `param`, `paramValues`, `header`, `headerValues`, `cookie`, `initParam`

##16. fejezet: Standard Actions & JavaBeans
- `<jsp:useBean>` kombinációi:
 - `class`: ezt példányosítja
 - `class`, `type`: így deklarálja
 - `beanName`, `type`: elõször deszerializálni próbál, sikertelen esetben példányosít
 - `type`: így deklarálja, de nem példányosítja, ha nincs a scope-ban `InstantiationException`
- `<jsp:setProperty>`
 - `name`: bean neve, useBean id-ja
 - `property`: property neve, vagy *
 - `value`: string vagy expression
 - `param`: melyik paramból vegye
- `<jsp:getProperty>`
- `jsp:include` tag/action page paramétert vár, mert dinamikus
- `jsp:forward`
- `jsp:param`

## 17. fejezet: Tag Libraries and the JSTL
- `<c:url>`
- `<c:import url>` - `RequestDispatcher`
- `<c:redirect url>`
- url, import, redirect paraméterezéséhez: `c:param`

## 18. fejezet: Custom Tags
- `javax.servlet.jsp.tagext` package
- `JspTag`, `Tag`, `IterationTag`, `TagSupport`, `BodyTag`, `BodyTagSupport`, `BodyContent`, `SimpleTag`, `JSPFragment`, `SimpleTagSupport`
- `doStartTag`: `EVAL_BODY_INCLUDE`, `SKIP_BODY`
- `doEndTag`: `EVAL_PAGE`, `SKIP_PAGE`
- Sorrend: `setPageContext`, `setParent`, setters, `doStartTag`, `doEndTag`
- `doAfterBody`: `SKIP_BODY`, `EVAL_BODY_AGAIN`
- `SKIP_BODY`, `EVAL_BODY_BUFFERED`
- `PageContext.pushBody`, `popBody`
- `SimpleTag` sorrend: `setJspContext`, `setParent`, setters, `setJspBody`, `doTag`
- A `SimpleTag` body nem tartalmazhat scripting elemet
- Tag handler poolozott
- `SimpleTag` mindig új példány
- `DynamicAttributes`
- `jsp:attribute`, `jsp:body`
- synchronization of scripting variable: `AT_BEGIN`, `NESTED`, `AT_END`
- `TagAdapter`

## 19. fejezet: Tag Files
- nincs pool
- JSP Context Wrapper
- variable synchronization
- `jsp:doBody`, `jsp:invoke`

## 20. fejezet: Tag Deployment
- `urn:jsptld:/`
- `urn:jsptagdir:/`

## 21. fejezet: Security
- `user-data-constraint` `NONE`, `INTEGRAL`, `CONFIDENTAL`
- `@ServletSecurity`
- `@HttpMethodConstraint`
- `@HttpConstraint`

## 22. fejezet: Java EE Patterns
- MVC
- Presentation tier: Front Controller, Intercepting filter,
- Business logic tier: Business delegate, service locator, transfer object
