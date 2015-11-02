# Java EE 6 Enterprise JavaBeans Developer Certified Expert (CX-311-093) és Java Persistence API Developer (CX-311-094) Exam segédlet

## Enterprise JavaBeans Developer

- Nagyon sok figyelmet fordít a role responsibility-re. Ez ugye azért meglepő, mert a könyvek szinte alig írnak róla, kizárólag a szabvány említi nagyon nagy pontossággal.
- `CreateException`, `RemoveException`, `FinderException` (`ObjectNotFoundException`) extends `Exception` - checked
- `EjbException` extends (indirect) `RuntimeException`
- `EJBTransactionRolledbackException` extends `EJBException`, megy a lokális klienseknek, ha rollback van, hogy a kliens tudja, hogy ne folytassa, hiszen úgyis rollback lesz - remote klienseknek `TransactionRolledbackException` megy
- `RemoteException` checked
- `RemoteException`-t nem dobhat bean, MDB bármi mást dobhat
- Az `env-entry-type` nem lehet primitív típus és `Date` sem
- EJB 3 meghívása 2-ből: `PortableRemoteObject.narrow`, ezt castolni, majd ezen `create`
- `Never` esetén, ha jön tranzakció: `EJBException`, mely system exception
- Nem feltétlenül lehet EJB-ből JMX-et hívni
- Üzenet kivétele nem része a tranzakciónak bean managed tranzakció esetén, tehát nincs redeliver
- Öröklődésnél a tranzakciós attribútumoknál az örökölt, de nem override-olt metódus tranzakciós attribútuma megmarad
- Interceptor csak olyan kivételt dobhat, mely deklarálva van az üzleti metódusban
- System exception esetén nem hívódnak meg az interceptor-ok

## Java Persistence API Developer

- Viszonylag sokat kérdez rá a JPA 3.1 újdonságára, a Criteria API-ra. Nagyon kell ismerni a szintaktikáját, mert általában leír egy EJB QL kifejezést, és meg kell mondani, hogy melyik Criteria API kódnak felel meg. Gyakran egy metódushívás különbség van. Itt gyakorlatilag tippeltem, mert sosem használtam még élesben. Tippjeim kétharmada jött be.
- Sok figyelmet fordít a optimista és pesszimista lockolásra.
- Version attribute nem lehet secondary táblában
- Bármennyi `MappedSuperclass` lehet a hierarchiában
- Primary key-t a hierarchiában csak egyszer lehet definiálni
- A `FETCH` a `JOIN` után van a JPQL-ben
