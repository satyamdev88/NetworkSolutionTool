import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { SunbetValue } from '../../data/ipv4';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-ipv4-calculator',
  imports: [CommonModule, NgFor, FormsModule, HeaderComponent, FooterComponent,ReactiveFormsModule],
  templateUrl: './ipv4-calculator.component.html',
  styleUrl: './ipv4-calculator.component.scss',
})
export class Ipv4CalculatorComponent {
  isVisible: boolean = false;
  subnetValue = SunbetValue;
  totalcidr = 32;

  selectedSubnet: string = '';
  identifiedSubnet: string = '';
  enteredIP: any;
  cidrValue: any;
  identifieCIDRValue: any;
  calculatedCIDR: any;
  usableHost: any;
  binarySubnetValue: any = [];
  totalHost: any;
  binaryIPaddress: any = [];
  networkBinary: any;
  NetworkIP: any;
  BroadCastIP: any;
  wildmaskCard: any;
  IPType: any;

  totalIP: { first: string; last: string } = { first: '', last: '' };
  myDict: { [key: string]: any } = {};
  BinaryValue = [128, 64, 32, 16, 8, 4, 2, 1];

  ngOnInit(): void {
      this.isVisible = false;
    this.selectedSubnet = this.subnetValue[0].Value;
  }
  

  // ===============Calculate IP details Function ==================
  calculateIPAddressValues(IPAddress: string) {
    if (IPAddress) {
      this.enteredIP = IPAddress;
      this.cidrValue = this.selectedSubnet.split('/');
      this.identifiedSubnet = this.cidrValue[0];
      this.identifieCIDRValue = this.cidrValue[1];
      this.cidrValue = '/' + this.cidrValue[1];
      this.NetworkIP = this.calculateNetworkIP(IPAddress, this.identifiedSubnet);
      this.totalIP = this.getUsableHostRange(IPAddress, this.identifiedSubnet);
      this.BroadCastIP = this.calculateBroadcastAddress(IPAddress,this.identifiedSubnet);
      this.wildmaskCard = this.getWildcardMask(this.identifiedSubnet);
      this.totalHost = this.calculateTotalHosts(this.identifieCIDRValue);
      this.usableHost = this.calculateUsableHosts(this.identifieCIDRValue);
      this.binarySubnetValue = this.getBinarySubnetValue();
      this.IPType = this.isPrivateIP(IPAddress);

      Object.assign(this.myDict, {
        'IP Address': IPAddress.trim(),
        'Network IP': this.NetworkIP.trim(),
        'Usable Host': `${this.totalIP.first} - ${this.totalIP.last}`,
        'Broadcast Address': this.BroadCastIP,
        'Total Number of Hosts': this.totalHost,
        'Number of Usable Hosts': this.usableHost,
        'Subnet Mask': this.identifiedSubnet.trim(),
        'Wildcard Mask': this.wildmaskCard.trim(),
        'Binary Subnet Mask': this.binarySubnetValue.trim(),
        CIDR: this.cidrValue,
        'IP Class': this.getIPClass(IPAddress),
        'IP Type': this.IPType,
      });
      this.isVisible = true;
    }
  }
  // ===============Network IP Function ==================
  calculateNetworkIP(ip: string, subnetMask: string): string {
    const ipOctets = ip.split('.').map(Number);
    const maskOctets = subnetMask.split('.').map(Number);

    if (ipOctets.length !== 4 || maskOctets.length !== 4) {
      return 'Invalid IP or subnet mask';
    }

    const networkOctets = ipOctets.map((octet, i) => octet & maskOctets[i]);
    return networkOctets.join('.');
  }

  // ===============Usable host IP Function ==================
  getUsableHostRange(
    ip: string,
    subnet: string
  ): { first: string; last: string } {
    const ipParts = ip.split('.').map(Number);
    const maskParts = subnet.split('.').map(Number);

    const network = ipParts.map((p, i) => p & maskParts[i]);
    const broadcast = ipParts.map((p, i) => p | (~maskParts[i] & 255));

    network[3] += 1;
    broadcast[3] -= 1;

    return {
      first: network.join('.'),
      last: broadcast.join('.'),
    };
  }
  // ===============Broadcast IP Function ==================
  calculateBroadcastAddress(ip: string, subnet: string): string {
    const ipParts = ip.split('.').map(Number);
    const maskParts = subnet.split('.').map(Number);

    if (ipParts.length !== 4 || maskParts.length !== 4) {
      Swal.fire({
        icon: 'error',
        title: 'nvalid IP or Subnet format',
        text: 'Please enter correct IP Address and try again',
      });
    }
    const broadcast = ipParts.map((part, i) => part | (~maskParts[i] & 255));
    return broadcast.join('.');
  }
  // ===============Total Number of Hosts Function ==================
  calculateTotalHosts(cidr: number): number {
    if (cidr < 0 || cidr > 32) {
      Swal.fire({
        icon: 'error',
        title: 'CIDR must be between 0 and 32',
        text: 'Please enter correct IP Address and try again',
      });
    }

    return Math.pow(2, 32 - cidr);
  }
  // ===============Number of Usable Hosts Function ==================
  calculateUsableHosts(cidr: number): number {
    if (cidr < 0 || cidr > 32) {
      Swal.fire({
        icon: 'error',
        title: 'CIDR must be between 0 and 32',
        text: 'Please enter correct IP Address and try again',
      });
    }

    const total = Math.pow(2, 32 - cidr);
    return cidr >= 31 ? 0 : total - 2;
  }

  // ===============Wildmask Card Function ==================
  getWildcardMask(subnet: string): string {
    const subnetOctets = subnet.split('.').map(Number);
    const wildcardOctets = subnetOctets.map((octet) => 255 - octet);
    return wildcardOctets.join('.');
  }

  getBinarySubnetValue(): any {
    this.identifieCIDRValue = Number(this.identifieCIDRValue);
    this.calculatedCIDR = this.totalcidr - this.identifieCIDRValue;

    for (let i = 0; i <= this.calculatedCIDR; i++) {
      if (this.identifieCIDRValue === SunbetValue[i].Option) {
        return this.subnetValue[i].BinaryValue;
      }
    }
  }
  // =============== IP Class Function ==================
  getIPClass(ip: string): string {
    const octets = ip.split('.').map((octet) => parseInt(octet, 10));

    if (
      octets.length !== 4 ||
      octets.some((o) => isNaN(o) || o < 0 || o > 255)
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid IP Address',
        text: 'Please enter correct IP Address and try again',
      });
      return '';
    }

    const [first] = octets;
    if (first >= 1 && first <= 127) return 'A';
    if (first >= 128 && first <= 191) return 'B';
    if (first >= 192 && first <= 223) return 'C';
    // return 'Unknown IP Address';
    Swal.fire({
        icon: 'error',
        title: 'Unknown IP Address',
        text: 'Please enter correct IP Address and try again',
      });
    return '';
  }
  // ===============Private/Public IP Function ==================
  isPrivateIP(ip: string): string {
    const octets = ip.split('.');
    if (
      octets.length !== 4 ||
      octets.some((o) => isNaN(+o) || +o < 0 || +o > 255)
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid IP address format',
        text: 'Please enter correct IP Address and try again',
      });
    }

    const [a, b] = octets.map(Number);

 if (a === 10)  return 'Private';
  if (a === 172 && b >= 16 && b <= 31)  return 'Private';
  if (a === 192 && b === 168)  return 'Private';

  return 'Public';
  }
   isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
  // ===============Clear IP Calculation Function ==================
  getClear() {
    window.location.reload();
  }
}
