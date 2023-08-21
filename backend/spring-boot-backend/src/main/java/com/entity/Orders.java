package com.entity;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.format.annotation.DateTimeFormat;
@Entity
public class Orders {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private int orderid;
@DateTimeFormat(pattern = "YYYY-mm-dd") // mysql default date format. 
private LocalDate orderplaced;
private int pidid; 
private String pidname; 
private float pidprice; 
private int pidqty;
private float ordertotal;
@ManyToOne
@JoinColumn(name = "emailid", referencedColumnName = "email")
private Account account;
public int getOrderid() {
	return orderid;
}
public void setOrderid(int orderid) {
	this.orderid = orderid;
}
public LocalDate getOrderplaced() {
	return orderplaced;
}
public void setOrderplaced(LocalDate orderplaced) {
	this.orderplaced = orderplaced;
}
public int getPidid() {
    return pidid;
}

public void setPidid(int pidid) {
    this.pidid = pidid;
}

public String getPidname() {
    return pidname;
}

public void setPidname(String pidname) {
    this.pidname = pidname;
}
public float getPidprice() {
    return pidprice;
}

public void setPidprice(Float pidprice) {
    this.pidprice = pidprice;
}
public int getPidqty() {
    return pidqty;
}

public void setPidqty(int pidqty) {
    this.pidqty = pidqty;
}
public float getOrdertotal() {
    return ordertotal;
}

public void setOrdertotal(float ordertotal) {
    this.ordertotal = ordertotal;
}
public Account getAccount() {
    return account;
}

public void setAccount(Account account) {
    this.account = account;
}

public String getEmailid() {
	if (account != null) {
        return account.getEmail();
    }
    return null;
}

}
