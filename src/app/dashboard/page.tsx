import Card from "../../components/card";
import styles from "@/styles/Dashboard.module.scss";

export default function Dashboard() {
  return (
    <div className={styles.dashboardSection}>
      <div className={styles.container}>
        <h1>My Envelopes</h1>
        <div className={styles.select}>
          <span>Sent</span>
          <span>Collected</span>
        </div>
      </div>
      <div className="flex flex-wrap mt-8 gap-10">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
