import {networkInterfaces} from 'os';

const showIp = (onInterface: 'eth0' = 'eth0'): string[] => {
  const IPs: string[] = [];
  const interfaces = networkInterfaces();

  Object.keys(interfaces).forEach((interfaceName: string) => {
    let alias = 0;
    interfaces[interfaceName]?.forEach(iface => {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (onInterface === 'eth0') {
        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          IPs.push(iface.address);
        } else {
          // this interface has only one ipv4 adress
          IPs.push(iface.address);
        }
      }
      ++alias;
    });
  });
  return IPs;
};

export default showIp;
